import React, { useState } from "react";
import { inferQueryOutput, trpc } from "../utils/trpc";
import { Listbox } from "@headlessui/react";
import * as options from "../data/selectOptions";
import { Controller, useForm } from "react-hook-form";
import Image from "next/future/image";
import { usePagination } from "../hooks/usePagination";

import Tag from "../../public/svg/tag.svg";
import DropdownArrow from "../../public/svg/dropdownArrow.svg";
import Check from "../../public/svg/check.svg";
import Location from "../../public/svg/location.svg";
import Home from "../../public/svg/home.svg";
import Price from "../../public/svg/price.svg";
import Area from "../../public/svg/area.svg";
import Clear from "../../public/svg/x.svg";
import Door from "../../public/svg/door.svg";
import Arrow from "../../public/svg/arrow.svg";

const Select = ({
  options,
  name,
  children,
  multiple,
  onChange,
  value,
}: {
  options: options.Options[] | options.OptionsSort[];
  name: string;
  children: React.ReactElement;
  multiple?: boolean;
  onChange: (v: options.OptionsSort) => void;
  value: any;
}) => {
  const isValueObject = typeof value === "object" && !Array.isArray(value);
  return (
    <Listbox
      as="div"
      className={`relative ${
        isValueObject ? "md:w-80" : "sm:flex-[1_1_300px]"
      }`}
      value={value}
      onChange={onChange}
      name={name}
      multiple={multiple}
    >
      <Listbox.Button className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-4 text-xs">
        {children}
        <span className="text-grey-500 capitalize">{name}&nbsp;</span>
        <span className="pr-4 font-medium text-blue-800">
          {isValueObject
            ? value.name
            : !value || value.length === 0
            ? "Select an option"
            : multiple
            ? value?.map((item: options.OptionsSort) => item).join(", ")
            : value}
        </span>
        <DropdownArrow aria-hidden="true" className="ml-auto mr-4" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-10 mt-1 w-full rounded-xl border border-blue-300 bg-[#FBFCFF] text-xs">
        {options.map((item) => (
          <Listbox.Option
            key={item.id}
            className="relative flex h-11 cursor-pointer select-none items-center pr-4 hover:rounded-xl  hover:bg-blue-100"
            value={!isValueObject ? item.name : item}
          >
            {({ selected }) => {
              const selectedCondition = isValueObject
                ? item.name === value.name
                : selected;
              return (
                <span
                  className={`block pl-11 ${
                    selectedCondition ? "font-medium" : "font-normal"
                  }`}
                >
                  {selectedCondition ? (
                    <Check
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 mr-2 ml-4 -translate-y-1/2"
                    />
                  ) : null}
                  {item.name}
                </span>
              );
            }}
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

const ITEMS_PER_PAGE = 3;

const Pagination = ({
  onArrowClick,
  onPageClick,
  lastPage,
  paginationRange,
  currentPage,
}: {
  onArrowClick: (sign: number) => void;
  onPageClick: (page: number) => void;
  lastPage: boolean;
  paginationRange: (number | string)[];
  currentPage: number;
}) => {
  return (
    <div className="mt-10 flex items-center justify-center gap-1.5 font-medium">
      <button
        className="pagination-arrow mr-1 disabled:opacity-40"
        onClick={() => onArrowClick(-ITEMS_PER_PAGE)}
        disabled={currentPage < 2}
      >
        <Arrow className="fill-white" />
      </button>
      {paginationRange.map((pageNumber, i) => {
        if (typeof pageNumber === "string") {
          return (
            <div
              className="pointer-events-none w-11 select-none text-center text-sm text-blue-500"
              key={pageNumber + i}
            >
              &#8230;
            </div>
          );
        }
        return (
          <div
            className={`pagination-page cursor-pointer select-none ${
              pageNumber === currentPage &&
              "border-blue-800 bg-blue-800 text-white"
            }`}
            key={pageNumber}
            onClick={() =>
              onPageClick(pageNumber * ITEMS_PER_PAGE - ITEMS_PER_PAGE)
            }
          >
            {pageNumber}
          </div>
        );
      })}
      <button
        className="pagination-arrow ml-1 disabled:opacity-40"
        onClick={() => onArrowClick(+ITEMS_PER_PAGE)}
        disabled={lastPage}
      >
        <Arrow className="rotate-180 fill-white" />
      </button>
    </div>
  );
};

type ShowEstatesOutput = inferQueryOutput<"estates.show-estates">;

const Items = ({
  data,
  isLoading,
  children,
  count,
}: {
  data: ShowEstatesOutput[1] | undefined;
  isLoading: boolean;
  children: React.ReactElement;
  count: ShowEstatesOutput[0] | undefined;
}) => {
  return (
    <section>
      <div className="spacer mt-20 md:flex md:items-center md:justify-between">
        <p className="mb-2.5 text-sm text-blue-800 md:mb-0">
          <span className="text-md font-medium text-blue-500">{count}</span>{" "}
          results
        </p>
        {children}
      </div>
      <div className="sm:spacer grid-container mt-10">
        {!isLoading &&
          data &&
          data.map((item) => (
            <div className="rounded-3xl bg-white shadow-small" key={item.id}>
              <Image
                className="w-full rounded-t-3xl"
                src="/img/home.jpg"
                alt="Estate"
                width={484}
                height={280}
              />
              <div className="flex flex-col gap-1.5 px-6 pt-4 pb-8 sm:px-8">
                <p className="flex items-center gap-2 text-xs uppercase text-grey-500">
                  {item.type}
                  <span className="h-1.5 w-1.5 rounded-full bg-grey-500"></span>
                  {item.for}
                </p>
                <p className="text-md font-semibold text-blue-800/90">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.price)}
                </p>
                <p className="text-sm tracking-tight text-blue-800/80">
                  {item.address}
                </p>
                <div className="flex gap-5 pt-2.5">
                  <div className="flex items-center gap-1">
                    <Area className="mt-[1px]" />
                    <p className="text-xs text-grey-500">{item.area} m²</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Door className="mt-[1px]" />
                    <p className="text-xs text-grey-500">{item.rooms} rooms</p>
                  </div>
                </div>
                <div className="my-4 h-[1px] w-full bg-blue-800/10" />
                <div className="flex items-center gap-3">
                  <div>
                    <Image
                      className="rounded-full"
                      src="/img/avatar.jpg"
                      alt="Estate"
                      width={46}
                      height={46}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-blue-800">Andrzej Kowalski</p>
                    <p className="text-xs text-grey-500">+48 111 222 333</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

const initialData = {
  for: ["Sell", "Rent"],
  city: "",
  type: "",
  maxArea: "",
  maxPrice: "",
  minArea: "",
  minPrice: "",
  skip: 0,
  take: ITEMS_PER_PAGE,
  sort: { name: "Largest Price", value: "price", order: "desc" },
};

const Listings = () => {
  const [formData, setFormData] = useState(initialData);
  // const context = trpc.useContext()
  const { data, isLoading } = trpc.useQuery(
    ["estates.show-estates", formData],
    {
      // refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      notifyOnChangeProps: "tracked",
      refetchOnMount: false,
    }
  );
  const [estatesCount, estatesData] = data || [];
  const { handleSubmit, control, register, reset } =
    useForm<typeof initialData>();

  const onSubmit = handleSubmit((data) =>
    setFormData({
      ...data,
      skip: initialData.skip,
      take: initialData.take,
      sort: initialData.sort,
    })
  );

  const currentPage = formData.skip / ITEMS_PER_PAGE + 1;
  const pagination = usePagination({
    totalCount: estatesCount || 0,
    pageSize: ITEMS_PER_PAGE,
    currentPage,
  });
  console.log(formData);
  return (
    <>
      <section className="mx-auto -mt-20 sm:px-6 lg:-mt-10 lg:px-10 xl:w-4/5 xl:px-0 4xl:w-[65vw] 4xl:max-w-[1530px]">
        <form
          onSubmit={onSubmit}
          className="relative z-20 space-y-2.5 rounded-3xl bg-white px-6 py-10 shadow-big sm:px-10"
        >
          <p className="mb-5 text-center text-sm font-semibold text-blue-800">
            Search by applying filters:
          </p>
          <div className="space-y-2.5 sm:flex sm:flex-wrap sm:gap-2.5 sm:space-y-0">
            <Controller
              defaultValue={[]}
              name="for"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  options={options.For}
                  name={name}
                  onChange={onChange}
                  value={value}
                  multiple={true}
                >
                  <Tag className="mr-2" aria-hidden="true" />
                </Select>
              )}
            />
            <Controller
              defaultValue=""
              name="type"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  options={options.Type}
                  name={name}
                  onChange={onChange}
                  value={value}
                >
                  <Home className="mr-2" aria-hidden="true" />
                </Select>
              )}
            />
            <Controller
              defaultValue=""
              name="city"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  options={options.City}
                  name={name}
                  onChange={onChange}
                  value={value}
                >
                  <Location className="mr-2" aria-hidden="true" />
                </Select>
              )}
            />
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
            <button className="btn-primary" type="submit">
              Apply
              <Check className="fill-white" />
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => {
                reset();
                setFormData(initialData);
              }}
            >
              Clear
              <Clear />
            </button>
          </div>
        </form>
      </section>
      <Items data={estatesData} isLoading={isLoading} count={estatesCount}>
        <Select
          options={options.Sort}
          name="Sort"
          value={formData.sort}
          onChange={(sort: options.OptionsSort) =>
            setFormData({
              ...formData,
              skip: 0,
              take: ITEMS_PER_PAGE,
              sort: { ...sort, value: sort.value, order: sort.order },
            })
          }
        >
          <Home className="mr-2" aria-hidden="true" />
        </Select>
      </Items>
      {!pagination || pagination.length < 2 ? null : (
        <Pagination
          onArrowClick={(sign = 0) =>
            setFormData((d) => ({
              ...formData,
              skip: d.skip + sign,
            }))
          }
          onPageClick={(page: number) =>
            setFormData({ ...formData, skip: page })
          }
          lastPage={formData.skip === estatesCount! - 1}
          paginationRange={pagination}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default Listings;
