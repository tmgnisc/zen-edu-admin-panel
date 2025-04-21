import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  BuildingOffice2Icon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import companiesData from "@/data/companies";

function ViewCompanies() {
  const [companies, setCompanies] = useState(companiesData);

  const handleDelete = (name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setCompanies((prev) => prev.filter((comp) => comp.name !== name));
    }
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="max-w-3xl mx-auto border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            All Companies
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-blue-gray-50">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-2">
                <div className="flex items-center gap-3">
                  <BuildingOffice2Icon className="h-5 w-5 text-blue-gray-500" />
                  <div>
                    <Typography variant="small" className="font-medium text-blue-gray-700">
                      {company.name}
                    </Typography>
                    <Typography variant="extra-small" className="text-xs text-blue-gray-400">
                      {company.location}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => alert(`Edit company: ${company.name}`)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="red"
                    onClick={() => handleDelete(company.name)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ViewCompanies;
