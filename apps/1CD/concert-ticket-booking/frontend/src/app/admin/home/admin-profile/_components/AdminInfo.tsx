'use client';
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateUserMutation } from '@/generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormLabel } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema=z.object({
  email: z.string().min(8, {
    message: 'Email must be at least 8 characters.',
  }),
  phoneNumber:z.string().min(8, {
    message:'Must be a valid number'
  }).max(14, {
    message:'Must be a valid number'
  }),
});

const inputs = [
  {
    name: 'phoneNumber',
    label: 'Утасны дугаар',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Имэйл хаяг',
    type: 'email',
  },
] as const;

const AdminInfo = () => {
  const {user, setRefresh}=useAuth();
  const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      email:'',
      phoneNumber:'',
    },
  });

  const [updateUser]=useUpdateUserMutation({
    onCompleted: ()=>{
      toast.success('User information succesfully updated');
      setRefresh((pre)=> !pre);
    },
    onError:(error)=>{
      toast.error(error.message);
    }
  });
  const onSubmit=async(values: z.infer<typeof formSchema>)=>{
    updateUser({variables:{input:{email: values.email, phoneNumber:values.phoneNumber}}});
  };
  useEffect(()=>{
    if(user){
      form.reset({
        email:user.email,
        phoneNumber:user.phoneNumber ?? '',
      });
    }
  }, [user, form]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='xl:w-[841px] md:w-[400px]  sm:w-[200px] m-auto flex flex-col mt-10 py-5 bg-[#fff] rounded-md'
      data-cy="Admin-Info-Title">
        <h1 className='font-semibold text-center'>Хэрэглэгчийн мэдээлэл</h1>
        {inputs.map((user)=>(
            <FormField key={user.label}
            control={form.control}
            name={user.name}
            render={({field})=>(
              <FormItem className='flex flex-col p-5 '
              data-cy={`Form-item=${user.name}`}>
                <FormLabel data-cy={`Form-label-${user.name}`}>
                  {user.label}
                </FormLabel>
                <FormControl>
                    <Input type={user.type}
                    placeholder={user.label}{...field}
                    data-cy={`Input-${user.name}`}/>
                </FormControl>
              </FormItem>
            )}>
          </FormField>
        ))}
        <div className='px-5'>
          <Button data-cy="Admin-Info-Update-Button">
            Хадгалах
          </Button>
        </div>
    </form>
    </Form>
  
  )
}

export default AdminInfo
