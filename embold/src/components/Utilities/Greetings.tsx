// import { Session } from "next-auth";
import { FC } from "react";

interface GreetingsProps {
  className?: string;
  //   session: Session | null;
}

const Greetings: FC<GreetingsProps> = ({ className }) => {
  const time = new Date().getHours();
  let greetings: string = "";

  if (time >= 0 && time < 12) {
    greetings = "Good Morning";
  } else if (time >= 12 && time < 4) {
    greetings = "Good Afternoon";
  } else if (time >= 4 && time <= 23) {
    greetings = "Good Evening";
  }
  return (
    <div className={className}>
      {greetings}
      {/* {session && `, ${session.user.name}`} */}
    </div>
  );
};

export default Greetings;
