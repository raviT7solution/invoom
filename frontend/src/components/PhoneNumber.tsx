import { Input, Select } from "antd";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useMemo, useState } from "react";

import { useCountries } from "../api";
import { selectLabelFilterSort } from "../helpers";

export const phoneNumberGetValueFromEvent = (i: string) => {
  return parsePhoneNumberFromString(i)?.number;
};

export const phoneNumberValidator = (_: unknown, i?: string) => {
  if (!i || !isValidPhoneNumber(i)) {
    return Promise.reject("Invalid phone number");
  }

  return Promise.resolve();
};

export const PhoneNumber = ({
  onChange = () => {},
  value = "",
}: {
  onChange?: (value: string) => void;
  value?: string;
}) => {
  const countries = useCountries();

  const [countryCode, setCountryCode] = useState<string | undefined>(
    () => parsePhoneNumberFromString(value)?.countryCallingCode,
  );
  const [nationalNumber, setNationalNumber] = useState<string | undefined>(
    () => parsePhoneNumberFromString(value)?.nationalNumber,
  );

  const countyCodesOptions = useMemo(
    () =>
      [...new Set(countries.data.map((i) => i.code))].map((i) => ({
        label: `+${i}`,
        value: i,
      })),
    [countries],
  );

  return (
    <Input
      addonBefore={
        <Select
          filterSort={selectLabelFilterSort}
          onChange={(i) => {
            setCountryCode(i);

            onChange(["+", i, nationalNumber].filter(Boolean).join(""));
          }}
          optionFilterProp="label"
          options={countyCodesOptions}
          placeholder="Select"
          showSearch
          style={{ width: 80 }}
          value={countryCode}
        />
      }
      onChange={(i) => {
        setNationalNumber(i.target.value);

        onChange(["+", countryCode, i.target.value].filter(Boolean).join(""));
      }}
      placeholder="Phone number"
      value={nationalNumber}
    />
  );
};
