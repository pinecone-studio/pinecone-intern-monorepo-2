import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

export const MenubarDemo = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Order</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Menu</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Food</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Table</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
};
