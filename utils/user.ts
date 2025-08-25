export type UserInfoData = {
  adult: {
    access: string;
    info: {
      id: number;
      firstname?: string;
      lastname?: string;
      [key: string]: any;
    };
  };
  child: {
    access: string;
    info: {
      id: number;
      firstname?: string;
      lastname?: string;
      [key: string]: any;
    };
  };
  [key: string]: any;
};
