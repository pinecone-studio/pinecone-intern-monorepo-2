'use client';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CategoryCombo } from './CategoryComboBox';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { uploadImageToCloudinary } from '../_utils/cloudinary-upload';

const UPDATE_FOOD = gql`
  mutation UpdateFood($_id: ID!, $name: String, $price: Float, $description: String, $image: String, $category: String) {
    updateFood(_id: $_id, name: $name, price: $price, description: $description, image: $image, category: $category) {
      _id
      name
      price
      description
      image
      category
    }
  }
`;

type FoodUpdateProps = {
  food: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    category?: string;
  };
  onUpdated?: () => void;
};

export const FoodUpdate = ({ food, onUpdated }: FoodUpdateProps) => {
  const [name, setName] = useState(food.name);
  const [price, setPrice] = useState(food.price.toString());
  const [description, setDescription] = useState(food.description || '');
  const [image] = useState(food.image || '');
  const [category, setCategory] = useState(food.category || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [updateFood, { loading }] = useMutation(UPDATE_FOOD);

  const handleUpdateFood = async () => {
    try {
      let imageUrl = image;
      if (imageFile) {
        imageUrl = (await uploadImageToCloudinary(imageFile)) ?? '';
      }
      await updateFood({
        variables: {
          _id: food._id,
          name,
          price: parseFloat(price),
          description,
          image: imageUrl,
          category,
        },
      });
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error('Error updating food:', e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[339px] h-auto gap-4">
        <DialogHeader className="h-3">
          <DialogTitle>Хоол засах</DialogTitle>
        </DialogHeader>
        <Input placeholder="Хоолны нэр" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <RadioGroup defaultValue="1">
          <div className="flex flex-col inline-flex">
            <div className="flex items-center gap-6">
              <RadioGroupItem value="default" id="r1" />
              <label>Идэвхитэй</label>
              <RadioGroupItem value="comfortable" id="r2" />
              <label>Идэвхигүй</label>
            </div>
          </div>
        </RadioGroup>
        <CategoryCombo value={category} onChange={setCategory} />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageFile(e.target.files[0]);
            }
          }}
        />
        <Input placeholder="Үнэ" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input placeholder="Тайлбар" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button className="w-full" onClick={handleUpdateFood} disabled={loading}>
          Шинэчлэх
        </Button>
      </DialogContent>
    </Dialog>
  );
};
