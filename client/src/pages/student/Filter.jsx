import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";

// Define categories with proper IDs that match the database values exactly
const categories = [
  // Web Development
  { id: "Web Development", label: "Web Development", group: "Development" },
  {
    id: "Frontend Development",
    label: "Frontend Development",
    group: "Development",
  },
  {
    id: "Backend Development",
    label: "Backend Development",
    group: "Development",
  },
  {
    id: "Fullstack Development",
    label: "Fullstack Development",
    group: "Development",
  },
  { id: "Web Design", label: "Web Design", group: "Development" },

  // Programming Languages
  { id: "Javascript", label: "Javascript", group: "Languages" },
  { id: "Python", label: "Python", group: "Languages" },
  { id: "Java", label: "Java", group: "Languages" },
  { id: "C#", label: "C#", group: "Languages" },
  { id: "PHP", label: "PHP", group: "Languages" },

  // Frameworks & Libraries
  { id: "Next JS", label: "Next JS", group: "Frameworks" },
  { id: "Angular", label: "Angular", group: "Frameworks" },
  { id: "Vue.js", label: "Vue.js", group: "Frameworks" },
  { id: "React.js", label: "React.js", group: "Frameworks" },
  { id: "Node.js", label: "Node.js", group: "Frameworks" },

  // Databases
  { id: "MongoDB", label: "MongoDB", group: "Databases" },
  { id: "MySQL", label: "MySQL", group: "Databases" },
  { id: "PostgreSQL", label: "PostgreSQL", group: "Databases" },

  // Cloud & DevOps
  { id: "AWS", label: "AWS", group: "Cloud" },
  { id: "Azure", label: "Azure", group: "Cloud" },
  { id: "Docker", label: "Docker", group: "Cloud" },
  { id: "Kubernetes", label: "Kubernetes", group: "Cloud" },

  // Data Science & AI
  { id: "Data Science", label: "Data Science", group: "Data" },
  { id: "Machine Learning", label: "Machine Learning", group: "Data" },
  {
    id: "Artificial Intelligence",
    label: "Artificial Intelligence",
    group: "Data",
  },

  // Mobile Development
  { id: "Android Development", label: "Android Development", group: "Mobile" },
  { id: "iOS Development", label: "iOS Development", group: "Mobile" },
  { id: "React Native", label: "React Native", group: "Mobile" },
  { id: "Flutter", label: "Flutter", group: "Mobile" },

  // Blockchain & Web3
  { id: "Blockchain", label: "Blockchain", group: "Blockchain" },
  { id: "Ethereum", label: "Ethereum", group: "Blockchain" },
  { id: "Smart Contracts", label: "Smart Contracts", group: "Blockchain" },
  { id: "Web3", label: "Web3", group: "Blockchain" },
  { id: "DeFi", label: "DeFi", group: "Blockchain" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Get unique groups
  const groups = [...new Set(categories.map((cat) => cat.group))];

  // Filter categories based on selected group
  const filteredCategories =
    selectedGroup && selectedGroup !== "all"
      ? categories.filter((cat) => cat.group === selectedGroup)
      : categories;

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

      console.log("Selected categories:", newCategories);
      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(
      selectedCategories,
      selectedValue === "none" ? "" : selectedValue
    );
  };

  return (
    <Card className="w-full md:w-[20%] shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-lg md:text-xl flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5 text-blue-600" />
            Filter Options
          </h1>
          <Select onValueChange={selectByPriceHandler} value={sortByPrice}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by price</SelectLabel>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low to High</SelectItem>
                <SelectItem value="high">High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        <div className="mb-4">
          <h1 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            CATEGORY GROUP
          </h1>
          <Select
            value={selectedGroup}
            onValueChange={(value) => {
              setSelectedGroup(value);
              setSelectedCategories([]); // Reset categories when group changes
              handleFilterChange([], sortByPrice); // Reset filter when group changes
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        <div>
          <h1 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            CATEGORIES
          </h1>
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 my-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                  className="border-blue-500 data-[state=checked]:bg-blue-500"
                />
                <Label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filter;
