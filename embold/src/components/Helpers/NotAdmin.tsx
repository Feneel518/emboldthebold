import { FC } from "react";

interface NotAdminProps {}

const NotAdmin: FC<NotAdminProps> = ({}) => {
  return <div>This page is for Admins only.</div>;
};

export default NotAdmin;
