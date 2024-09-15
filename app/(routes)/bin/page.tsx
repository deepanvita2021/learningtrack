"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definitions for Bin
interface Bin {
  id: number;
  location: string;
  sensorStatus: "Active" | "Inactive";
  fillLevel: number;
}

// Type definition for new or editing bin (as id could be an empty string)
interface BinForm {
  id: string;
  location: string;
  sensorStatus: "Active" | "Inactive" | "";
}

// Mock data for existing bins
const initialBins: Bin[] = [
  { id: 1, location: "Central Park", sensorStatus: "Active", fillLevel: 20 },
  { id: 2, location: "Malviya Nagar", sensorStatus: "Active", fillLevel: 85 },
  { id: 3, location: "Vashali Nagar", sensorStatus: "Inactive", fillLevel: 50 },
];

export default function BinManagementPage() {
  const [bins, setBins] = useState<Bin[]>(initialBins);
  const [newBin, setNewBin] = useState<BinForm>({
    id: "",
    location: "",
    sensorStatus: "",
  });
  const [editingBin, setEditingBin] = useState<Bin | null>(null);

  const addBin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(newBin.id);
    if (isNaN(id)) return;
    setBins([...bins, { ...newBin, id, fillLevel: 0 } as Bin]);
    setNewBin({ id: "", location: "", sensorStatus: "" });
  };

  const updateBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBin) return;
    setBins(bins.map((bin) => (bin.id === editingBin.id ? editingBin : bin)));
    setEditingBin(null);
  };

  const removeBin = (id: number) => {
    setBins(bins.filter((bin) => bin.id !== id));
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">
          Bin Management System
        </h1>

        {/* Add New Bin */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-700 flex items-center">
              <Plus className="mr-2" /> Add New Bin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addBin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-bin-id">Bin ID</Label>
                  <Input
                    id="new-bin-id"
                    value={newBin.id}
                    onChange={(e) =>
                      setNewBin({ ...newBin, id: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-bin-location">Location</Label>
                  <Input
                    id="new-bin-location"
                    value={newBin.location}
                    onChange={(e) =>
                      setNewBin({ ...newBin, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-bin-sensor">Sensor Status</Label>
                  <Select
                    value={newBin.sensorStatus}
                    onValueChange={(value) =>
                      setNewBin({ ...newBin, sensorStatus: value as "Active" | "Inactive" })
                    }
                  >
                    <SelectTrigger id="new-bin-sensor">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Add Bin
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Manage Bins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-700 flex items-center">
              <Trash2 className="mr-2" /> Manage Bins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bin ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sensor Status</TableHead>
                  <TableHead>Fill Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bins.map((bin) => (
                  <TableRow key={bin.id}>
                    <TableCell>{bin.id}</TableCell>
                    <TableCell>{bin.location}</TableCell>
                    <TableCell>{bin.sensorStatus}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          bin.fillLevel >= 80
                            ? "bg-red-500"
                            : bin.fillLevel >= 50
                            ? "bg-orange-500"
                            : "bg-green-500"
                        }`}
                      >
                        {bin.fillLevel}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingBin(bin)}
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Bin</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={updateBin} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-bin-location">Location</Label>
                                <Input
                                  id="edit-bin-location"
                                  value={editingBin?.location || ""}
                                  onChange={(e) =>
                                    setEditingBin({
                                      ...editingBin!,
                                      location: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-bin-sensor">Sensor Status</Label>
                                <Select
                                  value={editingBin?.sensorStatus || ""}
                                  onValueChange={(value) =>
                                    setEditingBin({
                                      ...editingBin!,
                                      sensorStatus: value as "Active" | "Inactive",
                                    })
                                  }
                                >
                                  <SelectTrigger id="edit-bin-sensor">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                Update Bin
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBin(bin.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-700 flex items-center">
              <AlertCircle className="mr-2" /> Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {bins
                .filter((bin) => bin.fillLevel >= 80)
                .map((bin) => (
                  <li
                    key={bin.id}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                  >
                    <p className="font-bold">
                      Alert: Bin {bin.id} is {bin.fillLevel}% full
                    </p>
                    <p>Location: {bin.location}</p>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
