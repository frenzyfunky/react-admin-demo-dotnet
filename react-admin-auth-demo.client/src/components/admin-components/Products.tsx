import { ComponentType, ReactElement, useEffect, useState } from 'react';
import {
   Datagrid,
   ImageField,
   List,
   NumberField,
   ResourceComponentProps,
   TextField,
   Edit,
   NumberInput,
   ResourceComponentPropsWithId,
   SimpleForm,
   TextInput,
   SelectInput,
   Create,
} from 'react-admin';
import { InputProps, required, useGetList, useRecordContext } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
   image: {
      width: '70px',
   },
   widthPercentage: (props: any) => {
      return { width: `${props.percentage}%` };
   },
});

export const ProductList: ComponentType<ResourceComponentProps> = (props) => {
   const classes = useStyles(40);
   return (
      <List {...props}>
         <Datagrid rowClick='edit'>
            <TextField source='id' />
            <TextField source='title' />
            <NumberField source='price' />
            <TextField source='description' />
            <TextField source='categoryName' />
            <ImageField source='image' className={classes.image} />
            <NumberField label={'Rate'} source='rating.rate' />
            <NumberField label={'Count'} source='rating.count' />
         </Datagrid>
      </List>
   );
};

const ImageWithUrlInput = (props: InputProps): ReactElement => {
   const record = useRecordContext(props);
   const [imageUrl, setImageUrl] = useState(record[props.source] as string);

   const handleOnBlur = (event: any) => {
      if (event.target.value !== imageUrl) {
         setImageUrl(event.target.value);
      }
   };

   return (
      <div>
         <img src={imageUrl} className='w-40 mb-5' />
         <div className='md:w-1/2 w-full'>
            <TextInput
               source={props.source}
               onBlur={handleOnBlur}
               style={{ width: '100%' }}
            />
         </div>
      </div>
   );
};

export const EditProduct: ComponentType<ResourceComponentPropsWithId> = (
   props
) => {
   const PostTitle = (props: any) => {
      return (
         <span>Product: {props.record ? `"${props.record.title}"` : ''}</span>
      );
   };

   const classes = useStyles({ percentage: 30 });
   return (
      <Edit title={<PostTitle />} {...props}>
         <SimpleForm>
            <TextInput
               disabled
               source='id'
               className={classes.widthPercentage}
            />
            <TextInput source='title' className={classes.widthPercentage} />
            <NumberInput source='price' className={classes.widthPercentage} />
            <TextInput
               multiline
               source='description'
               InputProps={{ style: { padding: '30px 10px' } }}
               style={{ width: '50%' }}
            />

            <TextInput source='categoryName' label='Category' />
            <ImageWithUrlInput source='image' />
            <NumberInput
               label='Rate'
               source='rating.rate'
               className={classes.widthPercentage}
            />
            <NumberInput
               label='Count'
               source='rating.count'
               className={classes.widthPercentage}
            />
         </SimpleForm>
      </Edit>
   );
};

export const CreateProduct: ComponentType<ResourceComponentProps> = (props) => {
   const classes = useStyles(40);
   return (
      <>
         <Create {...props}>
            <SimpleForm>
               <div className='mb-5 font-semibold text-xl'>Create</div>
               <TextInput
                  disabled
                  source='id'
                  className={classes.widthPercentage}
               />
               <TextInput source='title' className={classes.widthPercentage} />
               <NumberInput
                  source='price'
                  className={classes.widthPercentage}
               />
               <TextInput
                  multiline
                  source='description'
                  InputProps={{ style: { padding: '30px 10px' } }}
                  style={{ width: '50%' }}
               />

               <TextInput source='category' label='Category' />
               <ImageWithUrlInput source='image' />
               <NumberInput
                  label='Rate'
                  source='rating.rate'
                  className={classes.widthPercentage}
               />
               <NumberInput
                  label='Count'
                  source='rating.count'
                  className={classes.widthPercentage}
               />
            </SimpleForm>
         </Create>
      </>
   );
};
