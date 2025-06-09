import { uploadImageToCloudinary } from '../../../../src/app/admin/_utils/cloudinary-upload';

describe('uploadImageToCloudinary', () => {
  function createMockFile(): File {
    return new File(['dummy content'], 'test.png', { type: 'image/png' });
  }

  it('uploads file and returns secure URL', () => {
    const mockUrl = 'https://cloudinary.com/secure/test.png';

    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/ddcj2mdsk/upload', {
      statusCode: 200,
      body: {
        // eslint-disable-next-line camelcase
        secure_url: mockUrl,
      },
    }).as('cloudinaryUpload');

    const file = createMockFile();
    return uploadImageToCloudinary(file).then((result) => {
      cy.wait('@cloudinaryUpload').its('request.method').should('eq', 'POST');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result).to.equal(mockUrl);
    });
  });

  it('returns undefined if secure_url is missing', () => {
    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/ddcj2mdsk/upload', {
      statusCode: 200,
      body: {},
    }).as('cloudinaryUploadMissingUrl');

    const file = createMockFile();
    return uploadImageToCloudinary(file).then((result) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result).to.be.undefined;
    });
  });

  it('throws if fetch fails', () => {
    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/ddcj2mdsk/upload', {
      forceNetworkError: true,
    }).as('cloudinaryUploadFail');

    const file = createMockFile();
    return uploadImageToCloudinary(file)
      .then(() => {
        throw new Error('Should have thrown');
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(err.message).to.exist;
      });
  });

  it('sends correct FormData fields', () => {
    let interceptedBody: FormData | null = null;

    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/ddcj2mdsk/upload', (req) => {
      interceptedBody = req.body as unknown as FormData;
      req.reply({
        statusCode: 200,
        body: {
          // eslint-disable-next-line camelcase
          secure_url: 'mock',
        },
      });
    }).as('cloudinaryUploadFormData');

    const file = createMockFile();
    return uploadImageToCloudinary(file).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(interceptedBody).to.be.instanceOf(FormData);
      if (interceptedBody) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(interceptedBody.get('file')).to.equal(file);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(interceptedBody.get('upload_preset')).to.equal('your_upload_preset_here');
      }
    });
  });

  it('handles non-File input gracefully', () => {
    return uploadImageToCloudinary(undefined as unknown as File)
      .then(() => {
        throw new Error('Should have thrown');
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(err.message).to.equal('Invalid file input');
      });
  });
});
