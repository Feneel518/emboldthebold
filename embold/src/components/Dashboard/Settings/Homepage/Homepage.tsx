"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  SectionCreationRequest,
  SectionValidator,
} from "@/lib/validators/Sections";
import { Category } from "@/types/Category";
import { Sections } from "@/types/Sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowUpFromLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";

interface HomepageProps {
  categories: Category[];
  first: { id: string; categoryId: string; isActive: boolean };
  second: { id: string; categoryId: string; isActive: boolean };
  third: { id: string; categoryId: string; isActive: boolean };
  fourth: { id: string; categoryId: string; isActive: boolean };
  fifth: { id: string; categoryId: string; isActive: boolean };
}

const Homepage: FC<HomepageProps> = ({
  fifth,
  first,
  fourth,
  second,
  third,
  categories,
}) => {
  const router = useRouter();

  const [firstSection, setFirstSection] = useState<string>(
    first ? first.categoryId : ""
  );
  const [secondSection, setSecondSection] = useState<string>(
    second ? second.categoryId : ""
  );
  const [thirdSection, setThirdSection] = useState<string>(
    third ? third.categoryId : ""
  );
  const [fourthSection, setFourthSection] = useState<string>(
    fourth ? fourth.categoryId : ""
  );
  const [fifthSection, setFifthSection] = useState<string>(
    fifth ? fifth.categoryId : ""
  );

  // active states
  const [firstActive, setFirstActive] = useState<boolean>(
    first ? first.isActive : false
  );
  const [secondActive, setSecondActive] = useState<boolean>(
    second ? second.isActive : false
  );
  const [thirdActive, setThirdActive] = useState<boolean>(
    third ? third.isActive : false
  );
  const [fourthActive, setFourthActive] = useState<boolean>(
    fourth ? fourth.isActive : false
  );
  const [fifthActive, setFifthActive] = useState<boolean>(
    fifth ? fifth.isActive : false
  );

  const handleFirstSection = (data: { label: string; value: string }) => {
    setFirstSection(data.value);
  };
  const handleSecondSection = (data: { label: string; value: string }) => {
    setSecondSection(data.value);
  };
  const handleThirdSection = (data: { label: string; value: string }) => {
    setThirdSection(data.value);
  };
  const handleFourthSection = (data: { label: string; value: string }) => {
    setFourthSection(data.value);
  };
  const handleFifthSection = (data: { label: string; value: string }) => {
    setFifthSection(data.value);
  };

  const firstFilter = categories.filter(
    (cate) =>
      cate.id !== first?.categoryId &&
      cate.id !== secondSection &&
      cate.id !== thirdSection &&
      cate.id !== fourthSection &&
      cate.id !== fifthSection
  );
  const SecondFilter = categories.filter(
    (cate) =>
      cate.id !== firstSection &&
      cate.id !== second?.categoryId &&
      cate.id !== thirdSection &&
      cate.id !== fourthSection &&
      cate.id !== fifthSection
  );
  const ThirdFilter = categories.filter(
    (cate) =>
      cate.id !== firstSection &&
      cate.id !== secondSection &&
      cate.id !== third?.categoryId &&
      cate.id !== fourthSection &&
      cate.id !== fifthSection
  );
  const FourthFilter = categories.filter(
    (cate) =>
      cate.id !== firstSection &&
      cate.id !== thirdSection &&
      cate.id !== secondSection &&
      cate.id !== fourth?.categoryId &&
      cate.id !== fifthSection
  );
  const FifthFilter = categories.filter(
    (cate) =>
      cate.id !== firstSection &&
      cate.id !== secondSection &&
      cate.id !== thirdSection &&
      cate.id !== fifth?.categoryId &&
      cate.id !== fourthSection
  );

  const firstDefault = first
    ? categories.filter((id) => id.id === first.categoryId)
    : "";
  const secondDefault = second
    ? categories.filter((id) => id.id === second.categoryId)
    : "";
  const thirdDefault = third
    ? categories.filter((id) => id.id === third.categoryId)
    : "";
  const fourthDefault = fourth
    ? categories.filter((id) => id.id === fourth.categoryId)
    : "";
  const fifthDefault = fifth
    ? categories.filter((id) => id.id === fifth.categoryId)
    : "";

  const { handleSubmit } = useForm<SectionCreationRequest>({
    resolver: zodResolver(SectionValidator),
    defaultValues: {
      firstSection: "",
      secondSection: "",
      thirdSection: "",
      fourthSection: "",
      fifthSection: "",
      fifthActive: false,
      firstActive: false,
      fourthActive: false,
      secondActive: false,
      thirdActive: false,
    },
  });

  const onSubmit = () => {
    const payload: SectionCreationRequest = {
      firstSection: firstSection,
      secondSection: secondSection,
      thirdSection: thirdSection,
      fourthSection: fourthSection,
      fifthSection: fifthSection,
      fifthActive,
      firstActive,
      fourthActive,
      secondActive,
      thirdActive,
    };

    createSections(payload);
  };
  const { mutate: createSections } = useMutation({
    mutationFn: async ({
      firstSection,
      secondSection,
      thirdSection,
      fourthSection,
      fifthSection,
      fifthActive,
      firstActive,
      fourthActive,
      secondActive,
      thirdActive,
    }: SectionCreationRequest) => {
      const payload: SectionCreationRequest = {
        firstSection,
        secondSection,
        thirdSection,
        fourthSection,
        fifthSection,
        fifthActive,
        firstActive,
        fourthActive,
        secondActive,
        thirdActive,
      };

      const { data } = await axios.put("/api/dashboard/sections", payload);

      return data as string;
    },
    // if error
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 407) {
          return toast("Could not update banner, please try again later");
        }
      }
      return toast(
        "Something went wrong, Your sections was not uploaded. Please try again."
      );
    },
    // on success
    onSuccess: () => {
      router.refresh();

      return toast("New sections has been added");
    },
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="mb-1 text-xl">Home Page Settings</h1>
        <Separator></Separator>
      </div>
      <div className="w-full">
        <form
          action=""
          className="flex flex-col gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <div className="flex  items-center gap-4">
              <Label className="w-96 text-xl">First Product List Section</Label>
              <div className="w-full">
                <Select
                  // @ts-ignore
                  defaultValue={
                    firstDefault !== "" &&
                    firstDefault.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })
                  }
                  // @ts-ignore
                  onChange={(data) => handleFirstSection(data)}
                  className="text-emboldBlack "
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#D7D9CE20",
                      height: "50px",
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: state.isFocused ? "0" : "0",
                    }),
                    menu: (base, state) => ({
                      ...base,
                      backgroundColor: "#040404",
                      borderRadius: "10px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      color: state.isFocused ? "white" : "#040404",
                      backgroundColor: state.isFocused ? "#040404" : "white",
                      cursor: "pointer",
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: "#D7D9CE",
                    }),
                  }}
                  options={firstFilter?.map((category) => {
                    return {
                      label: category.name,
                      value: category.id,
                    };
                  })}
                ></Select>
              </div>

              <Switch
                checked={firstActive}
                onClick={() => setFirstActive(!firstActive)}
                color="secondary"
              ></Switch>
            </div>
          </div>
          <div className="flex  items-center gap-4">
            <Label className="w-96 text-xl">Second Product List Section</Label>
            <div className="w-full">
              <Select
                // @ts-ignore
                defaultValue={
                  secondDefault !== "" &&
                  secondDefault?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                }
                // @ts-ignore
                onChange={(data) => handleSecondSection(data)}
                className="text-emboldBlack "
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#D7D9CE20",
                    height: "50px",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: state.isFocused ? "0" : "0",
                  }),
                  menu: (base, state) => ({
                    ...base,
                    backgroundColor: "#040404",
                    borderRadius: "10px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isFocused ? "white" : "#040404",
                    backgroundColor: state.isFocused ? "#040404" : "white",
                    cursor: "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "#D7D9CE",
                  }),
                }}
                options={SecondFilter?.map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              ></Select>
            </div>
            <Switch
              checked={secondActive}
              onClick={() => setSecondActive(!secondActive)}
              color="secondary"
            ></Switch>
          </div>
          <div className="flex  items-center gap-4">
            <Label className="w-96 text-xl">Third Product List Section</Label>
            <div className="w-full">
              <Select
                // @ts-ignore
                defaultValue={
                  thirdDefault !== "" &&
                  thirdDefault?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                }
                // @ts-ignore
                onChange={(data) => handleThirdSection(data)}
                className="text-emboldBlack "
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#D7D9CE20",
                    height: "50px",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: state.isFocused ? "0" : "0",
                  }),
                  menu: (base, state) => ({
                    ...base,
                    backgroundColor: "#040404",
                    borderRadius: "10px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isFocused ? "white" : "#040404",
                    backgroundColor: state.isFocused ? "#040404" : "white",
                    cursor: "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "#D7D9CE",
                  }),
                }}
                options={ThirdFilter?.map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              ></Select>
            </div>

            <Switch
              checked={thirdActive}
              onClick={() => setThirdActive(!thirdActive)}
              color="secondary"
            ></Switch>
          </div>
          <div className="flex  items-center gap-4 ">
            <Label className="w-96 text-xl">Fourth Product List Section</Label>
            <div className="w-full">
              <Select
                // @ts-ignore
                defaultValue={
                  fourthDefault !== "" &&
                  fourthDefault?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                }
                // @ts-ignore
                onChange={(data) => handleFourthSection(data)}
                className="text-emboldBlack "
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#D7D9CE20",
                    height: "50px",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: state.isFocused ? "0" : "0",
                  }),
                  menu: (base, state) => ({
                    ...base,
                    backgroundColor: "#040404",
                    borderRadius: "10px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isFocused ? "white" : "#040404",
                    backgroundColor: state.isFocused ? "#040404" : "white",
                    cursor: "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "#D7D9CE",
                  }),
                }}
                options={FourthFilter?.map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              ></Select>
            </div>

            <Switch
              checked={fourthActive}
              onClick={() => setFourthActive(!fourthActive)}
              color="secondary"
            ></Switch>
          </div>
          <div className="flex  items-center gap-4">
            <Label className="w-96 text-xl">Fifth Product List Section</Label>
            <div className="w-full">
              <Select
                // @ts-ignore
                defaultValue={
                  fifthDefault !== "" &&
                  fifthDefault?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                }
                // @ts-ignore
                onChange={(data) => handleFifthSection(data)}
                className="text-emboldBlack "
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#D7D9CE20",
                    height: "50px",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: state.isFocused ? "0" : "0",
                  }),
                  menu: (base, state) => ({
                    ...base,
                    backgroundColor: "#040404",
                    borderRadius: "10px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isFocused ? "white" : "#040404",
                    backgroundColor: state.isFocused ? "#040404" : "white",
                    cursor: "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "#D7D9CE",
                  }),
                }}
                options={FifthFilter?.map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              ></Select>
            </div>

            <Switch
              checked={fifthActive}
              onClick={() => setFifthActive(!fifthActive)}
              color="secondary"
            ></Switch>
          </div>
          <Button variant="secondary" className="w-60 ">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Homepage;
