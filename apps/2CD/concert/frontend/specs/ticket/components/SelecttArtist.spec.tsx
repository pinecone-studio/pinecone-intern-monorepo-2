import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { FormProvider, useForm } from 'react-hook-form';
import { SelectArtist } from '@/app/(admin)/ticket/_components';
import { GetArtistsDocument } from '@/generated';
import '@testing-library/jest-dom';
import { FormField } from '@/components/ui/form';

const artistsMock = {
  request: {
    query: GetArtistsDocument,
  },
  result: {
    data: {
      getArtists: [
        { id: '1', name: 'Artist One' },
        { id: '2', name: 'Artist Two' },
      ],
    },
  },
};

const Wrapper = () => {
  const form = useForm<{ artists: string[] }>({
    defaultValues: {
      artists: [],
    },
  });

  return (
   <FormProvider {...form}>
      <form>
        {' '}
        <FormField control={form.control} name="artists" render={({ field }) => <SelectArtist defaultValue={field.value} setValue={field.onChange} />} />
      </form>
    </FormProvider>
  );
};

describe('SelectArtist', () => {
  it('should render and add an artist', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MockedProvider mocks={[artistsMock]} addTypename={false}>
        <Wrapper />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByPlaceholderText('артист нэмэх')).toBeInTheDocument();
    });

    // Open dropdown
    act(() => {
      fireEvent.mouseDown(getByPlaceholderText('артист нэмэх'));
    });

    await waitFor(() => {
      const artistButton = getByText('Artist One');
expect(document.body.contains(artistButton)).toBe(true);

    });

    // Click on artist
    act(() => {
      fireEvent.click(getByText('Artist One'));
    });

    // Should show as selected
    await waitFor(() => {
      expect(getByText('Artist One')).toBeInTheDocument();
    });
  });
});
