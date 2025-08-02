import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("https://github.com/shadcn.png");
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    bio: "",
  });

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
        address: userData.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        bio: userData.bio || "",
      });
      
      // Load profile image if exists
      if (userData.profileImage) {
        setProfileImage(userData.profileImage);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // Save to localStorage and potentially send to backend
    const updatedUser = { 
      ...user, 
      ...formData, 
      profileImage: profileImage 
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        bio: user.bio || "",
      });
      
      // Reset profile image to original
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      } else {
        setProfileImage("https://github.com/shadcn.png");
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              My Profile
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Manage your account information and preferences
            </p>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => {
                    e.target.src = "https://github.com/shadcn.png";
                  }}
                />
                {isEditing && (
                  <Button
                    size="sm"
                    onClick={handleCameraClick}
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700 shadow-lg border-2 border-gray-800"
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <h3 className="text-xl font-semibold text-white mb-1">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-gray-400 mb-2">@{formData.username}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date().toLocaleDateString()}
              </p>

              {formData.bio && (
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-gray-300 text-sm">{formData.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300 text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300 text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300 text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-300 text-sm font-medium">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem
                        value="male"
                        className="text-white hover:bg-gray-700"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className="text-white hover:bg-gray-700"
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value="other"
                        className="text-white hover:bg-gray-700"
                      >
                        Other
                      </SelectItem>
                      <SelectItem
                        value="prefer-not-to-say"
                        className="text-white hover:bg-gray-700"
                      >
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-300 text-sm font-medium">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300 text-sm font-medium">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white disabled:opacity-60 resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="address.street" className="text-gray-300 text-sm font-medium">
                  Street Address
                </Label>
                <Input
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="address.city" className="text-gray-300 text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.state" className="text-gray-300 text-sm font-medium">
                    State/Province
                  </Label>
                  <Input
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="address.zipCode" className="text-gray-300 text-sm font-medium">
                    ZIP/Postal Code
                  </Label>
                  <Input
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.country" className="text-gray-300 text-sm font-medium">
                    Country
                  </Label>
                  <Input
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
