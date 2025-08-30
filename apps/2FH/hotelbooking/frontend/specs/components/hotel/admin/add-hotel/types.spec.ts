import { Policy, FaqItem, OptionalExtra, FormData } from '../../../../../src/components/admin/add-hotel/types';

describe('Add Hotel Types', () => {
  describe('Policy interface', () => {
    it('should have all required properties', () => {
      const policy: Policy = {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: 'Please present valid ID',
        accessMethods: ['Key card', 'Mobile app'],
        childrenAndExtraBeds: 'Children under 12 stay free',
        pets: 'Pets not allowed',
      };

      expect(policy.checkIn).toBe('14:00');
      expect(policy.checkOut).toBe('11:00');
      expect(policy.specialCheckInInstructions).toBe('Please present valid ID');
      expect(policy.accessMethods).toEqual(['Key card', 'Mobile app']);
      expect(policy.childrenAndExtraBeds).toBe('Children under 12 stay free');
      expect(policy.pets).toBe('Pets not allowed');
    });
  });

  describe('FaqItem interface', () => {
    it('should have question and answer properties', () => {
      const faqItem: FaqItem = {
        question: 'What time is check-in?',
        answer: 'Check-in is available from 2:00 PM',
      };

      expect(faqItem.question).toBe('What time is check-in?');
      expect(faqItem.answer).toBe('Check-in is available from 2:00 PM');
    });
  });

  describe('OptionalExtra interface', () => {
    it('should have youNeedToKnow and weShouldMention properties', () => {
      const optionalExtra: OptionalExtra = {
        youNeedToKnow: 'Free breakfast included',
        weShouldMention: '24/7 front desk service',
      };

      expect(optionalExtra.youNeedToKnow).toBe('Free breakfast included');
      expect(optionalExtra.weShouldMention).toBe('24/7 front desk service');
    });
  });

  describe('FormData interface', () => {
    it('should have all required properties', () => {
      const formData: FormData = {
        name: 'Test Hotel',
        description: 'A beautiful test hotel',
        stars: 4,
        phone: '+1234567890',
        rating: 8.5,
        city: 'Test City',
        country: 'Test Country',
        location: '123 Test Street',
        languages: ['English', 'Spanish'],
        amenities: [],
        policies: [],
        optionalExtras: [],
        faq: [],
      };

      expect(formData.name).toBe('Test Hotel');
      expect(formData.description).toBe('A beautiful test hotel');
      expect(formData.stars).toBe(4);
      expect(formData.phone).toBe('+1234567890');
      expect(formData.rating).toBe(8.5);
      expect(formData.city).toBe('Test City');
      expect(formData.country).toBe('Test Country');
      expect(formData.location).toBe('123 Test Street');
      expect(formData.languages).toEqual(['English', 'Spanish']);
      expect(formData.amenities).toEqual([]);
      expect(formData.policies).toEqual([]);
      expect(formData.optionalExtras).toEqual([]);
      expect(formData.faq).toEqual([]);
    });
  });
}); 