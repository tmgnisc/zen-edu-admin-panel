import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  FolderIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import categories from "@/data/categories";


function ViewCategories() {
  return (
    <div className="mt-12 mb-8">
      <Card className="max-w-2xl mx-auto border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            All Job Categories
          </Typography>
        </CardHeader>
        <CardBody>
        <div className="divide-y divide-blue-gray-50">
  {categories.map((category, index) => (
    <div key={index} className="flex items-center justify-between py-3 px-2">
      <div className="flex items-center gap-3">
        <FolderIcon className="h-5 w-5 text-blue-gray-500" />
        <Typography variant="small" className="font-medium text-blue-gray-700">
          {category}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <IconButton variant="text" color="blue-gray" onClick={() => alert(`Edit: ${category}`)}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
        <IconButton
          variant="text"
          color="red"
          onClick={() => {
            if (confirm(`Delete category "${category}"?`)) {
              alert(`Deleted: ${category}`); // Replace with logic later
            }
          }}
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

export default ViewCategories;
