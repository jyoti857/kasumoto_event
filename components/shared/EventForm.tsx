'use client'
import { useForm} from 'react-hook-form'
import { IEvent } from "@/lib/database/models/event.model";
import { useState } from "react";
import {useUploadThing} from '@/lib/uploadthing'
import { eventformSchema } from "@/lib/validator";
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { eventDefaultValues } from '@/constants';
import Dropdown from './Dropdown';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import ReactDatePicker from 'react-datepicker';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
// import { FileUploader } from './FileUploader';

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
}
const EventForm = ({ type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter();
  const initialValues = event && type === 'Update' ? {
    ...event,
    startDateTime: new Date(event.startDateTime),
    endDateTime: new Date(event.endDateTime)
  }: eventDefaultValues
  // const {startUpload} = useUploadThing('imageUploader')
  const form = useForm<z.infer<typeof eventformSchema>>({
    resolver: zodResolver(eventformSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: z.infer<typeof eventformSchema>){
    // let uploadedImageUrl = values.imageUrl;
    console.log("event payload values === ", values)
    if(files.length > 0){
      // const uploadedImages = await startUpload(files);
      // if(!uploadedImages){
      //   return;
      // }
      // uploadedImageUrl = uploadedImages[0].url;
    }
    if(type === 'Create'){
      try{
        const newEvent = await createEvent({
          event: {
            ...values, 
            imageUrl: "https://images.unsplash.com/photo-1705792960060-a8deefe94a40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D"//uploadedImageUrl
          },
          // userId: "2103-23",
          path: '/profile'
        })
        console.log("@@@type create")
        if(newEvent){
          form.reset();
          router.push(`/events/${newEvent._id}`)
        }
      }catch(err){
        console.log("error while onSubmit from Event form -- ", err);
      }
    }
    if(type === 'Update'){
      if(!eventId){
        router.back();
        return;
      }
      try{
        const updatedEvent = await updateEvent({
          // userId,
          event: {
            ...values,
            imageUrl: "https://images.unsplash.com/photo-1705792960060-a8deefe94a40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",
            _id: eventId,
          } as any,
          path: `/events/${eventId}`
        })
        if(updatedEvent){
          form.reset();
          router.push(`/events/${updatedEvent._id}`)
        }
      }catch(err){
        console.log("error while updating the event from EventForm -- ", err)
      }
    }
  }
  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='title'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input placeholder="Event title" {...field} className='input-field' />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="categoryId"
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Dropdown 
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField 
            control={form.control}
            name='description'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <Textarea placeholder='Descripton' {...field} className='textarea rounded-2xl' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField 
            control={form.control}
            name='imageUrl'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <div className='flex flex-col gap-5 md:flex-row bg-red-300'>
          <FormField 
            control={form.control}
            name='location'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image
                      src='/assets/icons/location-grey.svg'
                      alt='calendar'
                      width={24}
                      height={24}
                    />
                    <Input placeholder='Event location or Online' {...field} className='input-field'/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField 
            control={form.control}
            name='startDateTime'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                      src="/assets/icons/calendar.svg"
                      alt='calendar'
                      width={24}
                      height={24}
                      className='filter-grey'
                    />
                    <p className='ml-3 whitespace-nowrap text-grey-600'>Start Date:</p>
                    <ReactDatePicker 
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel='Time:'
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName='datePicker'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name='endDateTime'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                      src='/assets/icons/calendar.svg'
                      alt='calendar'
                      width={24}
                      height={24}
                      className='filter-grey'
                    />
                    <p className='ml-3 whitespace-nowrap text-grey-600'>End Date:</p>
                    <ReactDatePicker 
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      dateFormat='MM/dd/yyyy h:mm aa'
                      wrapperClassName='datePicker'
                    />  
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField 
            control={form.control}
            name='price'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                      src='/assets/icons/dollar.svg'
                      alt='dollar'
                      width={24}
                      height={24}
                      className='filter-grey'
                    />
                    <Input type='number' placeholder='Price' {...field} className='p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0'/>
                    <FormField 
                      control={form.control}
                      name='isFree'
                      render={({field}) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex items-center'>
                              <label htmlFor='isFree' className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Free Ticket</label>
                              <Checkbox 
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id='isFree'
                                className='mr-2'
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name='url'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                      src='/assets/icons/link.svg'
                      alt='link'
                      width={24}
                      height={24}
                    />
                    <Input placeholder='URL' {...field} className='input-field'/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? ('submitting...'):`${type} Event`}
        </Button>
      </form>
    </Form>
  ) 
}

export default EventForm;
