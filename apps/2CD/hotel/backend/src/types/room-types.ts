export interface CreateRoomArgs {
    hotel: string;
    roomNumber: string;
    type: string;
    price: number;
  }
  
  export interface UpdateRoomArgs {
    id: string;
    hotel?: string;
    roomNumber?: string;
    type?: string;
    price?: number;
  }
  
  export interface DeleteRoomArgs {
    id: string;
  }
  
  export interface GetRoomArgs {
    id: string;
  }