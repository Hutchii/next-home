import React from "react";
import { trpc } from "../utils/trpc";
import { Listbox } from "@headlessui/react";
import { forOptions } from "../data/selectOptions";
import { useController, UseControllerProps, useForm } from "react-hook-form";

import Tag from "../../public/svg/tag.svg";
import DropdownArrow from "../../public/svg/dropdownArrow.svg";
import Check from "../../public/svg/check.svg";
import Location from "../../public/svg/location.svg";
import Home from "../../public/svg/home.svg";
import Price from "../../public/svg/price.svg";
import Area from "../../public/svg/area.svg";
import Clear from "../../public/svg/x.svg";

type Options = {
  id: number;
  name: string;
};

type SelectProps = {
  options: Options[];
  name: string;
  children: React.ReactElement;
};

const SelectMultiple = (props: SelectProps & UseControllerProps) => {
  const {
    field: { value, onChange, name },
  } = useController(props);

  const shownValues = value?.map((item: Options) => item.name).join(", ");

  return (
    <Listbox
      as="div"
      className="relative w-full flex-[1_1_300px]"
      name={name}
      value={value}
      onChange={onChange}
      multiple
    >
      <Listbox.Button className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-4 text-xs">
        {props.children}
        <span className="text-grey-500">{props.name}&nbsp;</span>
        <span className="pr-4 font-medium text-blue-800">
          {shownValues ? shownValues : "Select an option"}
        </span>
        <DropdownArrow aria-hidden="true" className="ml-auto mr-4" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-10 mt-1 w-full rounded-2xl border border-blue-300 bg-[#FBFCFF] text-xs">
        {props.options.map((item) => (
          <Listbox.Option
            key={item.id}
            className="relative cursor-pointer select-none py-2.5 pr-4 hover:rounded-2xl hover:bg-blue-100"
            value={item}
          >
            {({ selected }) => (
              <span
                className={`block pl-11 ${
                  selected ? "font-medium" : "font-normal"
                }`}
              >
                {selected ? (
                  <Check
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 mr-2 ml-4 -translate-y-1/2"
                  />
                ) : null}
                {item.name}
              </span>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

const Select = (props: SelectProps & UseControllerProps) => {
  const {
    field: { value, onChange, name },
  } = useController(props);

  return (
    <Listbox
      as="div"
      className="relative w-full flex-[1_1_300px]"
      value={value}
      onChange={onChange}
      name={name}
    >
      <Listbox.Button className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-4 text-xs">
        {props.children}
        <span className="text-grey-500">{props.name}&nbsp;</span>
        <span className="pr-4 font-medium text-blue-800">
          {value ? value.name : "Select an option"}
        </span>
        <DropdownArrow aria-hidden="true" className="ml-auto mr-4" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-10 mt-1 w-full rounded-2xl border border-blue-300 bg-[#FBFCFF] text-xs">
        {props.options.map((item) => (
          <Listbox.Option
            key={item.id}
            className="relative cursor-pointer select-none py-2.5 pr-4 hover:rounded-2xl  hover:bg-blue-100"
            value={item}
          >
            <span
              className={`block pl-11 ${
                item.name === (value as Options)?.name
                  ? "font-medium"
                  : "font-normal"
              }`}
            >
              {item.name === (value as Options)?.name ? (
                <Check
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 mr-2 ml-4 -translate-y-1/2"
                />
              ) : null}
              {item.name}
            </span>
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { placeholder: string; children: React.ReactElement };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, children, ...props }, ref) => (
    <div className="relative flex-1">
      <input
        {...props}
        ref={ref}
        type="number"
        placeholder={placeholder}
        className="h-10 w-full rounded-full border border-blue-300 bg-[#FBFCFF] pl-11 pr-4 text-xs font-medium text-blue-800 placeholder:text-xs placeholder:font-normal placeholder:text-grey-500"
      />
      {children}
    </div>
  )
);

Input.displayName = "Input";

const Listings = () => {
  const { handleSubmit, control, register } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // const { data: someData, refetch } = trpc.useQuery([
  //   "estates.show-estates",
  //   data,
  // ]);
  return (
    <section>
      <form
        onSubmit={onSubmit}
        className="spacer relative z-20 -mt-20 space-y-2.5 rounded-3xl bg-white py-10 shadow-big"
      >
        <p className="mb-5 text-center text-sm font-semibold text-blue-800">
          Search by applying filters:
        </p>
        <div className="space-y-2.5 sm:flex sm:flex-wrap sm:gap-2.5 sm:space-y-0">
          <SelectMultiple
            options={forOptions}
            name="For"
            control={control}
            defaultValue={[]}
          >
            <Tag className="mr-2" aria-hidden="true" />
          </SelectMultiple>
          <Select
            options={forOptions}
            control={control}
            name="Type"
            defaultValue=""
          >
            <Home className="mr-2" aria-hidden="true" />
          </Select>
          <Select
            options={forOptions}
            control={control}
            name="City"
            defaultValue=""
          >
            <Location className="mr-2" aria-hidden="true" />
          </Select>
        </div>
        <div className="space-y-2.5 sm:flex sm:flex-wrap sm:gap-2.5 sm:space-y-0">
          <div className="flex w-full flex-[1_1_320px] items-center gap-1">
            <Input placeholder="Min Price" {...register("minPrice")}>
              <Price
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
            <span className="text-grey-500">-</span>
            <Input placeholder="Max Price" {...register("maxPrice")}>
              <Price
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
          </div>
          <div className="flex w-full flex-[1_1_320px] items-center gap-1">
            <Input placeholder="Min Area" {...register("minArea")}>
              <Area
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
            <span className="text-grey-500">-</span>
            <Input placeholder="Max Area" {...register("maxArea")}>
              <Area
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
          </div>
        </div>
        <div className="flex justify-center gap-2.5 pt-2.5">
          <button className="btn-primary">
            Apply
            <Check className="fill-white" />
          </button>
          <button className="btn-secondary">
            Clear
            <Clear />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Listings;
