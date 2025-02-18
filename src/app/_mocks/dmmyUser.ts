import { User } from "@/app/_types/User";

const dummyUser: User[] = [
  {
    id: "1",
    name: "user1",
    password: "user1_p",
    button: [
      {
        id: "buttonid",
        postId: "1d4cbd35-6ec2-4f34-b3e7-4a9b35a60d1a",
        userId: "1",
        push: false,
      },
      {
        id: "buttonid2",
        postId: "24f932b8-231b-429b-b9dc-569f07ba16a7",
        userId: "1",
        push: false,
      },
      {
        id: "buttonid3",
        postId: "36b7c693-4cce-4d73-afa3-acb54a404290",
        userId: "1",
        push: true,
      },
    ],
  },
  {
    id: "2",
    name: "user2",
    password: "user2_p",
    button: [
      {
        id: "buttonid",
        postId: "1d4cbd35-6ec2-4f34-b3e7-4a9b35a60d1a",
        userId: "1",
        push: false,
      },
    ],
  },
];

export default dummyUser;
