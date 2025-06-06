import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Order } from './Order';

export const MenubarDemo = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Order</MenubarTrigger>
        <MenubarContent><Order/></MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent></MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent></MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent></MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
