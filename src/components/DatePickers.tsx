import React, { useState, useEffect, useRef, useCallback } from 'react';
import Picker from 'rmc-picker';
import Jalaali from 'jalaali-js';
import { CodeComponentMeta } from '@plasmicapp/host';
import 'rmc-picker/assets/index.css';

type DatePickersProps = {
  onChange?: (values: { day: number; month: number; year: number }) => void;
  SelectedDay?: number;
  SelectedMonth?: number;
  SelectedYear?: number;
  selectedValues?: { day: number; month: number; year: number };
  customYears?: { value: number; label: string }[]; // پراپ جدید برای ورودی سال‌ها
  className?: string;
};

export const DatePickers = (props: DatePickersProps) => {
  const {
    onChange,
    SelectedDay = 5,
    SelectedMonth = 10,
    SelectedYear = 1403,
    selectedValues = {},
    customYears = [], // مقدار پیش‌فرض برای customYears
    className,
  } = props;

  const [selectedDay, setSelectedDay] = useState<number>(SelectedDay);
  const [selectedMonth, setSelectedMonth] = useState<number>(SelectedMonth);
  const [selectedYear, setSelectedYear] = useState<number>(SelectedYear);

  const toPersianDigits = (num: number | string): string => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
  };

  const getDaysOfMonth = (month: number, year: number) => {
    const daysInMonth = Jalaali.jalaaliMonthLength(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => ({
      value: i + 1,
      label: toPersianDigits(i + 1),
    }));
  };

  const currentYear = Jalaali.toJalaali(new Date()).jy;

  // آرایه ماه‌ها
  const months = [
    { value: 1, label: 'فروردین' },
    { value: 2, label: 'اردیبهشت' },
    { value: 3, label: 'خرداد' },
    { value: 4, label: 'تیر' },
    { value: 5, label: 'مرداد' },
    { value: 6, label: 'شهریور' },
    { value: 7, label: 'مهر' },
    { value: 8, label: 'آبان' },
    { value: 9, label: 'آذر' },
    { value: 10, label: 'دی' },
    { value: 11, label: 'بهمن' },
    { value: 12, label: 'اسفند' },
  ].map((month) => ({ ...month, label: toPersianDigits(month.label) }));

  // آرایه سال‌ها
  const years =
    customYears.length > 0
      ? customYears
      : Array.from({ length: currentYear - 1300 + 1 }, (_, i) => {
          const year = 1300 + i;
          return { value: year, label: toPersianDigits(year) };
        });

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const values = { day: selectedDay, month: selectedMonth, year: selectedYear };
    if (onChangeRef.current) {
      onChangeRef.current(values);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    setSelectedDay(SelectedDay);
    setSelectedMonth(SelectedMonth);
    setSelectedYear(SelectedYear);
  }, [SelectedDay, SelectedMonth, SelectedYear]);

  const handleChangeDay = useCallback(
    (value: string | number) => {
      if (selectedDay !== Number(value)) {
        setSelectedDay(Number(value));
      }
    },
    [selectedDay]
  );

  const handleChangeMonth = useCallback(
    (value: string | number) => {
      if (selectedMonth !== Number(value)) {
        setSelectedMonth(Number(value));
      }
    },
    [selectedMonth]
  );

  const handleChangeYear = useCallback(
    (value: string | number) => {
      if (selectedYear !== Number(value)) {
        setSelectedYear(Number(value));
      }
    },
    [selectedYear]
  );

  return (
    <div className={className}>
      <Picker selectedValue={selectedDay} onValueChange={handleChangeDay}>
        {getDaysOfMonth(selectedMonth, selectedYear).map((day) => (
          <Picker.Item key={day.value} value={day.value}>
            {day.label}
          </Picker.Item>
        ))}
      </Picker>

      <Picker selectedValue={selectedMonth} onValueChange={handleChangeMonth}>
        {months.map((month) => (
          <Picker.Item key={month.value} value={month.value}>
            {month.label}
          </Picker.Item>
        ))}
      </Picker>

      <Picker selectedValue={selectedYear} onValueChange={handleChangeYear}>
        {years.map((year) => (
          <Picker.Item key={year.value} value={year.value}>
            {year.label}
          </Picker.Item>
        ))}
      </Picker>
    </div>
  );
};

export const DatePickersMeta: CodeComponentMeta<DatePickersProps> = {
  name: 'DatePickers',
  importPath: '@/components/DatePickers',
  props: {
    onChange: {
      type: 'eventHandler',
      argTypes: [
        {
          name: 'selectedValues',
          type: 'object',
        },
      ],
      description: 'Callback function to handle changes in selected day, month, and year.',
    },
    SelectedDay: {
      type: 'number',
      defaultValue: 10,
    },
    SelectedMonth: {
      type: 'number',
      defaultValue: 10,
    },
    SelectedYear: {
      type: 'number',
      defaultValue: 1379,
    },
    selectedValues: {
      type: 'object',
      defaultValue: {},
    },
    customYears: {
      type: 'object',
      defaultValue: [],
      description: 'Custom years array to override the default generated years.',
    },
  },
  states: {
    value: {
      type: 'writable',
      variableType: 'object',
      valueProp: 'selectedValues',
      onChangeProp: 'onChange',
    },
  },
};
