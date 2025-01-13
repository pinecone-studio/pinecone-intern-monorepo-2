'use client';
import React, { useEffect, useState } from 'react'
import AdminInfo from './_components/AdminInfo'
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useAuth } from '@/components/providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserRoleMutation } from '@/generated';
import { toast } from 'sonner';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { FormControl, FormLabel } from '@mui/material';
import { Input } from '@/components/ui/input';

const formSchema=z.object({
  email: z.string().min(8, {
    message: 'Email must be at least 8 characters.',
  }),
  role:z.string().max(5),
});

const input = [{
  name:'email',
  label:'Хэрэглэгчийн имэйл хаяг',
  type:'text'
},
{
  name:'role',
  label:'"admin" or "user"',
  type:'text'
}] as const;
const Page = () => {
  const {user, setRefresh}=useAuth();
  const [step, setStep]=useState(1);
  const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      email:'',
      role:'',
    },
  });
    const [updateUserRole]=useUpdateUserRoleMutation({
      onCompleted:()=>{
        toast.success('User role succesfully updated');
        setRefresh((pre)=>!pre)
      },
      onError:(error)=>{
        toast.error(error.message);
      }
    });
    const onSubmit=async(values: z.infer<typeof formSchema>)=>{
      updateUserRole({variables:{input:{email:values.email, role:values.role}}});
    };
    useEffect(()=>{
      if(user){
        form.reset({
          email:user.email,
          role:user.role ?? '',
        })
      }
    }, [user,form])
  return (
    <div className='lg:flex lg:items-center sm:max-w-flex sm:max-w-flex-col max-sm:mx-10 max-sm:my-10 md:flex' data-cy="Admin-Info-Page">
        <div className='flex flex-col gap-4 m-auto'>
            <Button className='bg-[#fff] border border-[#000] text-black hover:text-white'
            data-cy="Info-Step-Button"
            onClick={()=>setStep(1)}>Хувийн мэдээлэл шинэчлэх</Button>
            <Button className='bg-[#fff] border border-[#000] text-black hover:text-white'
            data-cy="Admin-Role-Step-Button"
            onClick={()=>setStep(2)}>Админ эрх үүсгэх</Button>
        </div>
        {step ===1 && <AdminInfo/>}
        {step===2 && 
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className='xl:w-[841px] md:w-[400px] sm:w-[200px] m-auto flex flex-col mt-10 py-5 bg-[#fff] rounded-md'
           data-cy="Admin-Role-Update-Title">
            <h1 className='font-semibold text-center'>Админ эрх үүсгэх</h1>
            {input.map((admin)=>(
              <FormField
              key={admin.label}
              control={form.control}
              name={admin.name}
              render={({field})=>(
                <FormItem className='flex flex-col p-5'
                data-cy={`Form-item-${admin.name}`}>
                  <FormLabel data-cy={`Form-label-${admin.name}`}>
                    {admin.label}
                  </FormLabel>
                  <FormControl data-cy={`Form-control-${admin.name}`}>
                    <Input type={admin.type}
                    placeholder={admin.label}{...field}
                    data-cy={`Input-${admin.name}`}/>
                  </FormControl>
                </FormItem>
              )}>

              </FormField>
            ))}
            <div className='px-5'>
            <Button data-cy="Admin-Role-Submit-Button">
              Хадгалах
            </Button>
            </div>
            </form>
        </Form>
       }
    </div>
  )
}

export default Page;
