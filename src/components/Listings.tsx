import React, { useState, useRef, forwardRef } from "react";
import { trpc } from "../utils/trpc";
import { Listbox } from "@headlessui/react";
import { forOptions } from "../data/selectOptions";

import Tag from "../../public/svg/tag.svg";
import DropdownArrow from "../../public/svg/dropdownArrow.svg";
import Check from "../../public/svg/check.svg";
import Location from "../../public/svg/location.svg";
import Home from "../../public/svg/home.svg";
import Price from "../../public/svg/price.svg";
import Area from "../../public/svg/area.svg";
import Clear from "../../public/svg/x.svg";

interface SelectProps {
  options: typeof forOptions;
  label: string;
  children: React.ReactElement;
}

const SelectMultiple = forwardRef<HTMLButtonElement, SelectProps>(
  (props, ref) => {
    const [selected, setSelected] = useState([
      props.options[0],
      props.options[1],
    ]);
    const selectedItems = selected.map((item) => item?.name).join(", ");
    return (
      <Listbox
        as="div"
        className="relative w-full flex-[1_1_300px]"
        value={selected}
        onChange={setSelected}
        multiple
      >
        <Listbox.Button
          ref={ref}
          value={selectedItems}
          className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-4 text-xs"
        >
          {props.children}
          <span className="text-grey-500">{props.label}&nbsp;</span>
          <span className="pr-4 font-medium text-blue-800">
            {selectedItems.length === 0
              ? "Please select options"
              : selectedItems}
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
  }
);

SelectMultiple.displayName = "SelectMultiple";

const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const [selected, setSelected] = useState({ id: 0, name: "" });
  return (
    <Listbox
      as="div"
      className="relative w-full flex-[1_1_300px]"
      value={selected}
      onChange={setSelected}
    >
      <Listbox.Button
        ref={ref}
        value={selected.name ? selected.name : ""}
        className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-4 text-xs"
      >
        {props.children}
        <span className="text-grey-500">{props.label}&nbsp;</span>
        <span className="pr-4 font-medium text-blue-800">
          {selected.name ? selected.name : "Select an option"}
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
});

Select.displayName = "Select";

const Input = forwardRef<
  HTMLInputElement,
  { placeholder: string; children: React.ReactElement }
>((props, ref) => {
  return (
    <div className="relative flex-1">
      <input
        ref={ref}
        type="number"
        placeholder={props.placeholder}
        className="h-10 w-full rounded-full border border-blue-300 bg-[#FBFCFF] pl-11 pr-4 text-xs font-medium text-blue-800 placeholder:text-xs placeholder:font-normal placeholder:text-grey-500"
      />
      {props.children}
    </div>
  );
});

Input.displayName = "Input";

const Listings = () => {
  const [data, setData] = useState(false);
  const forRef = useRef(null);
  const typeRef = useRef(null);
  const cityRef = useRef(null);

  // const { data: someData, refetch } = trpc.useQuery([
  //   "estates.show-estates",
  //   data,
  // ]);
  return (
    <section>
      <div className="spacer relative z-20 -mt-20 space-y-2.5 rounded-3xl bg-white py-10 shadow-big">
        <p className="mb-5 text-center text-sm font-semibold text-blue-800">
          Search by applying filters:
        </p>
        <div className="space-y-2.5 sm:flex sm:flex-wrap sm:gap-2.5 sm:space-y-0">
          <SelectMultiple ref={forRef} options={forOptions} label="For">
            <Tag className="mr-2" aria-hidden="true" />
          </SelectMultiple>
          <Select ref={typeRef} options={forOptions} label="Type">
            <Home className="mr-2" aria-hidden="true" />
          </Select>
          <Select ref={cityRef} options={forOptions} label="City">
            <Location className="mr-2" aria-hidden="true" />
          </Select>
        </div>
        <div className="space-y-2.5 sm:flex sm:flex-wrap sm:gap-2.5 sm:space-y-0">
          <div className="flex w-full flex-[1_1_320px] items-center gap-1">
            <Input placeholder="Min Price">
              <Price
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
            <span className="text-grey-500">-</span>
            <Input placeholder="Max Price">
              <Price
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
          </div>
          <div className="flex w-full flex-[1_1_320px] items-center gap-1">
            <Input placeholder="Min Area">
              <Area
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
            <span className="text-grey-500">-</span>
            <Input placeholder="Max Area">
              <Area
                className="absolute top-1/2 left-4 -translate-y-1/2"
                aria-hidden="true"
              />
            </Input>
          </div>
        </div>
        <div className="flex gap-2.5 justify-center pt-2.5">
          <button className="btn-primary">
            Apply
            <Check className="fill-white" />
          </button>
          <button className="btn-secondary">
            Clear
            <Clear />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Listings;
