'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { uploadImageToCloudinary } from '../_utils/cloudinary-upload';
import { CategoryCombo } from './CategoryComboBox';
const CREATE_FOOD = gql`
  mutation CreateFood($name: String!, $price: Float!, $description: String, $image: String, $category: String) {
    createFood(name: $name, price: $price, description: $description, image: $image, category: $category) {
      _id
      name
      price
      description
      image
      category
    }
  }
`;

export const AddFoodButton = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [createFood, { loading, error }] = useMutation(CREATE_FOOD);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');

  const handleCreateFood = async () => {
    try {
      let imageUrl = image;
      if (imageFile) {
        imageUrl = (await uploadImageToCloudinary(imageFile)) ?? '';
      }
      await createFood({
        variables: {
          name,
          price: parseFloat(price),
          description,
          image: imageUrl,
          category,
        },
      });
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setImageFile(null);
      setCategory('');
    } catch (e) {
      console.error('Error creating food:', e);
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-white text-black text-sm font-medium font-['GIP'] leading-tight outline outline-[#E4E4E7]">Хоол +</Button>
        </DialogTrigger>
        <DialogContent className="w-[339px] h-auto gap-4">
          <DialogHeader className="h-3">
            {/* Food Name Input */}
            <DialogTitle>Хоол нэмэх</DialogTitle>
          </DialogHeader>
          <Input placeholder="Хоолны нэр" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {/* Radio Group */}
          <RadioGroup defaultValue="1">
            <div className="flex flex-col inline-flex">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="default" id="r1" />
                <label className="text-sm font-medium font-['GIP'] leading-none">Идэвхитэй</label>
                <RadioGroupItem value="comfortable" id="r2" />
                <label className="text-sm font-medium font-['GIP'] leading-none">Идэвхигүй</label>
              </div>
            </div>
          </RadioGroup>
          {/* Category Combo Box */}
          <div>
            <CategoryCombo value={category} onChange={setCategory} />
          </div>
          <div>
            {/* Image Input */}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </div>
          {/* Price Input */}
          <div>
            <Input placeholder="Үнэ" value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
          </div>
          {/* Description Input */}
          <div>
            <textarea
              placeholder="Тайлбар"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-normal resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ minHeight: '40px', maxHeight: '200px' }}
            />
          </div>
          {/* Create Food Button */}
          <div>
            <Button className="w-full text-sm font-medium font-['Inter'] leading-tight" onClick={handleCreateFood} disabled={loading}>
              Үүсгэх
              {loading && <span className="ml-2">Loading...</span>}
            </Button>
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
