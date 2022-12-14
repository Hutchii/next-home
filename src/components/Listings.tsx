import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import { Listbox } from "@headlessui/react";
import { options, Options, OptionsSort } from "../data/selectOptions";
import { Controller, useForm } from "react-hook-form";
import Image from "next/future/image";
import { usePagination } from "../hooks/usePagination";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
import Heart from "../../public/svg/heart.svg";
import { awsURL } from "../utils/awsURL";

const Select = ({
  options,
  name,
  children,
  onChange,
  value,
}: {
  options: Options[] | OptionsSort[];
  name: string;
  children: React.ReactElement;
  onChange: (value: OptionsSort) => void;
  value:
    | string
    | string[]
    | {
        name: string;
        value: string;
        order: string;
      };
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
      multiple={Array.isArray(value)}
    >
      {({ open }) => (
        <>
          <Listbox.Button
            className={`flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-4 text-xs ${
              open ? "outline-none ring-1 ring-blue-300" : ""
            }`}
          >
            {children}
            <span className="capitalize text-grey-500">{name}&nbsp;</span>
            <span className="pr-4 font-medium text-blue-800">
              {isValueObject
                ? value.name
                : !value || value.length === 0
                ? "Select an option"
                : Array.isArray(value)
                ? value.map((item) => item).join(", ")
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
        </>
      )}
    </Listbox>
  );
};

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  placeholder: string;
  children?: React.ReactElement;
  type: string;
  max?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, children, type, max, ...props }, ref) => (
    <div className="relative flex-1">
      <input
        {...props}
        ref={ref}
        type={type}
        max={max ? max : undefined}
        placeholder={placeholder}
        className={`h-10 w-full rounded-full border border-blue-300 bg-[#FBFCFF] pl-11 pr-4 text-xs font-medium text-blue-800 outline-none placeholder:text-xs placeholder:font-normal placeholder:text-grey-500 focus:ring-1 focus:ring-blue-300`}
      />
      {children}
    </div>
  )
);
Input.displayName = "Input";

const ITEMS_PER_PAGE = 3;

const initialForm = {
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

type initialForm = typeof initialForm;

const Pagination = ({
  lastPage,
  paginationRange,
  currentPage,
  setForm,
}: {
  lastPage: boolean | undefined;
  paginationRange: (number | string)[];
  currentPage: number;
  setForm: React.Dispatch<React.SetStateAction<initialForm>>;
}) => {
  const onClickHandler = (value: number, page?: boolean) =>
    setForm((d: initialForm) => ({
      ...d,
      skip: page ? value : d.skip + value,
    }));
  return (
    <>
      <button
        className="pagination-arrow mr-1 disabled:opacity-40"
        onClick={() => onClickHandler(-ITEMS_PER_PAGE)}
        disabled={currentPage < 2}
      >
        <Arrow className="fill-white" />
      </button>
      {paginationRange.map((page, i) =>
        typeof page === "string" ? (
          <div
            className="pointer-events-none w-11 select-none text-center text-sm text-blue-500"
            key={page + i}
          >
            &#8230;
          </div>
        ) : (
          <div
            className={`pagination-page cursor-pointer select-none ${
              page === currentPage && "border-blue-800 bg-blue-800 text-white"
            }`}
            key={page}
            onClick={() =>
              onClickHandler(page * ITEMS_PER_PAGE - ITEMS_PER_PAGE, true)
            }
          >
            {page}
          </div>
        )
      )}
      <button
        className="pagination-arrow ml-1 disabled:opacity-40"
        onClick={() => onClickHandler(ITEMS_PER_PAGE)}
        disabled={lastPage}
      >
        <Arrow className="rotate-180 fill-white" />
      </button>
    </>
  );
};
// type ShowEstatesOutput = inferQueryOutput<"estates.show-estates">;

const Items = ({
  children,
  form,
  setForm,
}: {
  children: React.ReactElement;
  form: initialForm;
  setForm: React.Dispatch<React.SetStateAction<initialForm>>;
}) => {
  const { data: session } = useSession();
  const qc = trpc.useContext();
  const { data, isLoading } = trpc.useQuery(["estates.show-estates", form], {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: "tracked",
    refetchOnMount: false,
  });
  const [estatesCount, estatesData] = data || [];
  const mutation = trpc.useMutation("user.addFavourites", {
    onMutate: async (input) => {
      await qc.cancelQuery(["estates.show-estates", form]);
      const prevData = qc.getQueryData(["estates.show-estates", form]);
      const sessionId = session?.user?.id;
      if (prevData) {
        qc.setQueryData(["estates.show-estates", form], () => {
          const filteredData = prevData[1]?.map((f) =>
            f.id === input.id && sessionId
              ? {
                  ...f,
                  favouritesId: input.action
                    ? f.favouritesId.filter((f) => f.id !== sessionId)
                    : [...f.favouritesId, { id: sessionId }],
                }
              : f
          );
          return [prevData[0], filteredData];
        });
      }
      return { prevData };
    },
    onError: (err, newTodo, context) => {
      if (context?.prevData)
        qc.setQueryData(["estates.show-estates", form], context?.prevData);
    },
    onSettled: () => {
      qc.invalidateQueries(["estates.show-estates", form]);
    },
  });

  const currentPage = form.skip / ITEMS_PER_PAGE + 1;
  const pagination = usePagination({
    totalCount: estatesCount,
    pageSize: ITEMS_PER_PAGE,
    currentPage,
  });
  return (
    <section>
      <div className="spacer mt-20 md:flex md:items-center md:justify-between">
        <p className="mb-2.5 text-sm text-blue-800 md:mb-0">
          <span className="text-md font-medium text-blue-500">
            {estatesCount}
          </span>{" "}
          results
        </p>
        {children}
      </div>
      <div className="sm:spacer grid-container mt-10">
        {!isLoading &&
          estatesData &&
          estatesData.map((item) => {
            return (
              <Link
                href={`/estate/${item.name}`}
                className="relative rounded-3xl bg-white shadow-small"
                key={item.id}
              >
                <Image
                  className="w-full rounded-t-3xl"
                  src={awsURL(item.Image[0])}
                  alt="Estate"
                  width={484}
                  height={280}
                />
                {session && (
                  <button
                    className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-grey-400/80"
                    onClick={() => {
                      mutation.mutate({
                        id: item.id,
                        action: item.favouritesId[0]?.id === session?.user?.id,
                      });
                    }}
                  >
                    <Heart
                      className={`h-8 w-8  ${
                        item.favouritesId[0]?.id === session?.user?.id
                          ? "fill-red-500"
                          : ""
                      }`}
                    />
                  </button>
                )}
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
                      <p className="text-xs text-grey-500">{item.area} m??</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Door className="mt-[1px]" />
                      <p className="text-xs text-grey-500">
                        {item.rooms} rooms
                      </p>
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
              </Link>
            );
          })}
      </div>
      <div className="mt-10 flex h-10 items-center justify-center gap-1.5 font-medium">
        {!pagination || pagination.length < 2 || !estatesCount ? null : (
          <Pagination
            setForm={setForm}
            lastPage={form.skip + ITEMS_PER_PAGE >= estatesCount}
            paginationRange={pagination}
            currentPage={currentPage}
          />
        )}
      </div>
    </section>
  );
};

const Listings = () => {
  const [form, setForm] = useState(initialForm);
  const {
    handleSubmit,
    // formState: { errors },
    control,
    register,
    reset,
  } = useForm<initialForm>();
  const onSubmit = handleSubmit((data) =>
    setForm((d) => ({
      ...data,
      skip: d.skip,
      take: d.take,
      sort: d.sort,
    }))
  );
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
                  options={options.for}
                  name={name}
                  onChange={onChange}
                  value={value}
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
                  options={options.type}
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
                  options={options.city}
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
              <Input
                placeholder="Min Price"
                {...register("minPrice")}
                type="number"
                max="9999999"
              >
                <Price
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                  aria-hidden="true"
                />
              </Input>
              <span className="text-grey-500">-</span>
              <Input
                placeholder="Max Price"
                {...register("maxPrice")}
                type="number"
                max="9999999"
              >
                <Price
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                  aria-hidden="true"
                />
              </Input>
            </div>
            <div className="flex w-full flex-[1_1_320px] items-center gap-1">
              <Input
                placeholder="Min Area"
                {...register("minArea")}
                type="number"
                max="9999999"
              >
                <Area
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                  aria-hidden="true"
                />
              </Input>
              <span className="text-grey-500">-</span>
              <Input
                placeholder="Max Area"
                {...register("maxArea")}
                type="number"
                max="9999999"
              >
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
                setForm(initialForm);
              }}
            >
              Clear
              <Clear />
            </button>
          </div>
        </form>
      </section>
      <Items form={form} setForm={setForm}>
        <Select
          options={options.sort}
          name="Sort"
          value={form.sort}
          onChange={(sort: OptionsSort) =>
            setForm({
              ...form,
              skip: initialForm.skip,
              take: initialForm.take,
              sort: { ...sort, value: sort.value, order: sort.order },
            })
          }
        >
          <Home className="mr-2" aria-hidden="true" />
        </Select>
      </Items>
    </>
  );
};

export default Listings;
