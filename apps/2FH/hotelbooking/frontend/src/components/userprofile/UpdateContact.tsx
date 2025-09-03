import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CountryCodeSelect } from "./CountryCodeSelect";
import UpdateSettings from "./UpdateSettings";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

// GraphQL mutation for updating user
const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      firstName
      lastName
      email
      dateOfBirth
      role
    }
  }
`;

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    contactEmail: '',
    emergencyPhone: '',
    relationship: ''
  });
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: "Updated First Name",
    lastName: "Updated Last Name",
    email: "puntsagg0@gmail.com",
    dateOfBirth: "1990-01-01",
    phoneNumber: "",
    contactEmail: "",
    emergencyPhone: "",
    relationship: "",
    otherRelationship: ""
  });

  const handleInputChange = (field: string, value: string) => {
    // firstName болон lastName талбаруудад эхний үсгийг том үсэг болгож, үлдсэнийг жижиг үсэг болгох
    let processedValue = value;
    if (field === 'firstName' || field === 'lastName') {
      // Зөвхөн үсэг, зай, цэг зөвшөөрөх
      const cleanedValue = value.replace(/[^a-zA-Zа-яёА-ЯЁ\s.]/g, '');
      // Эхний үсгийг том үсэг болгож, үлдсэнийг жижиг үсэг болгох
      processedValue = cleanedValue.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Утга оруулах үед алдааны мессежийг арилгах
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Утга оруулах үед дараагийн хуудас руу шилжихгүй - зөвхөн Update profile товчлуур дарсны дараа л шилжинэ
  };

  const handleUpdateProfile = async () => {
    // Баталгаажуулалт - бүх шаардлагатай талбарууд хоосон байгаа эсэхийг шалгах
    const newErrors = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      contactEmail: '',
      emergencyPhone: '',
      relationship: ''
    };
    
    let hasErrors = false;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Fill in your first name';
      hasErrors = true;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Fill in your last name';
      hasErrors = true;
    }
    
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Fill in your date of birth';
      hasErrors = true;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Fill in your phone number';
      hasErrors = true;
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Fill in your contact email';
      hasErrors = true;
    }
    
    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Fill in emergency contact phone number';
      hasErrors = true;
    }
    
    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Select relationship';
      hasErrors = true;
    }
    
    setErrors(newErrors);
    
    // Алдаа байвал дараагийн хуудас руу шилжихгүй
    if (hasErrors) {
      return;
    }
    
    try {
      const userId = "68afeb9f4185206ea2d22d46";
      
      const result = await updateUser({
        variables: {
          input: {
            _id: userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            dateOfBirth: formData.dateOfBirth
          }
        }
      });

      console.log("User updated successfully:", result.data);
      alert("Profile updated successfully!");
      
      setShowSettings(true);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleBackToContact = () => {
    setShowSettings(false);
  };

  if (showSettings) {
    return <UpdateSettings />;
  }

  return (
    <div className="flex-1" data-testid="update-contact">
      {/* Main Content */}
      <div className="p-8 max-w-2xl mx-auto">
        <div className="space-y-12">
          <PersonalInfoForm 
            formData={formData} 
            onInputChange={handleInputChange} 
            errors={errors}
          />
          <ContactInfoForm 
            formData={formData} 
            onInputChange={handleInputChange} 
            errors={errors}
          />
          <EmergencyContactForm 
            formData={formData} 
            onInputChange={handleInputChange} 
            errors={errors}
          />
          <UpdateButton onUpdateProfile={handleUpdateProfile} />
        </div>
      </div>
    </div>
  );
}

function PersonalInfoForm({ 
  formData, 
  onInputChange,
  errors
}: { 
  formData: { firstName: string; lastName: string; email: string; dateOfBirth: string; phoneNumber: string; contactEmail: string; emergencyPhone: string; relationship: string; otherRelationship: string };
  onInputChange: (field: string, value: string) => void;
  errors: { firstName: string; lastName: string; dateOfBirth: string; phoneNumber: string; contactEmail: string; emergencyPhone: string; relationship: string };
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-3">Personal Information</h2>
      <p className="text-sm text-gray-600 mb-8">
        Update your personal information
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">First Name</label>
          <Input 
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Write your first name" 
            className={`w-full ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">Fill in your first name</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Last Name</label>
          <Input 
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Write your last name" 
            className={`w-full ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">Fill in your last name</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Date of Birth</label>
        <Input 
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
          className={`w-full ${errors.dateOfBirth ? 'border-red-500' : ''}`}
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1">Fill in your date of birth</p>
        )}
      </div>
    </div>
  );
}

function ProfileHeader({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Hi, {name}</h1>
      <p className="text-gray-500">{email}</p>
    </div>
  );
}

function ContactInfoForm({ 
  formData, 
  onInputChange,
  errors
}: { 
  formData: { phoneNumber: string; contactEmail: string };
  onInputChange: (field: string, value: string) => void;
  errors: { phoneNumber: string; contactEmail: string };
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-3">Contact info</h2>
      <p className="text-sm text-gray-600 mb-8">
        Receive account activity alerts and trip updates by sharing this information
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Phone number</label>
          <div className="flex gap-3">
            <CountryCodeSelect />
            <Input 
              className={`flex-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              placeholder="Enter phone number" 
              value={formData.phoneNumber}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Email address</label>
          <Input 
            placeholder="Enter email address" 
            className={`w-full ${errors.contactEmail ? 'border-red-500' : ''}`}
            value={formData.contactEmail}
            onChange={(e) => onInputChange('contactEmail', e.target.value)}
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function EmergencyContactForm({ 
  formData, 
  onInputChange,
  errors
}: { 
  formData: { emergencyPhone: string; relationship: string; otherRelationship: string };
  onInputChange: (field: string, value: string) => void;
  errors: { emergencyPhone: string; relationship: string };
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-3">Emergency Contact</h2>
      <p className="text-sm text-gray-600 mb-8">
        In case of emergencies, having someone we can reach out to is essential.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Phone number</label>
          <div className="flex gap-3">
            <CountryCodeSelect />
            <Input 
              className={`flex-1 ${errors.emergencyPhone ? 'border-red-500' : ''}`}
              placeholder="Enter phone number" 
              value={formData.emergencyPhone}
              onChange={(e) => onInputChange('emergencyPhone', e.target.value)}
            />
          </div>
          {errors.emergencyPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Relationship</label>
          <Select 
            value={formData.relationship} 
            onValueChange={(value) => onInputChange('relationship', value)}
          >
            <SelectTrigger className={`w-full ${errors.relationship ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="sibling">Sibling</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.relationship && (
            <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
          )}
          {formData.relationship === 'other' && (
            <div className="mt-3">
              <Input 
                placeholder="Please specify relationship" 
                value={formData.otherRelationship}
                onChange={(e) => onInputChange('otherRelationship', e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpdateButton({ onUpdateProfile }: { onUpdateProfile: () => void }) {
  return (
    <div className="flex justify-center">
      <Button 
        onClick={onUpdateProfile}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg"
      >
        Update profile
      </Button>
    </div>
  );
}
