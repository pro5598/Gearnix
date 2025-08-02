import { useState } from "react";
import {
  Settings,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserSettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!passwordForm.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters long",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form on success
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage({ type: "success", text: "Password updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;

    if (strength <= 2) return { strength, text: "Weak", color: "text-red-400" };
    if (strength <= 3)
      return { strength, text: "Fair", color: "text-yellow-400" };
    if (strength <= 4)
      return { strength, text: "Good", color: "text-blue-400" };
    return { strength, text: "Strong", color: "text-green-400" };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Account Settings
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          Manage your account security and preferences
        </p>
      </div>

      {/* Password Change Section */}
      <div className="max-w-2xl">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Update your password to keep your account secure
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Message Display */}
              {message.text && (
                <div
                  className={`p-4 rounded-lg border flex items-center gap-2 ${
                    message.type === "success"
                      ? "bg-green-900/20 border-green-500/30 text-green-400"
                      : "bg-red-900/20 border-red-500/30 text-red-400"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-gray-300 text-sm font-medium"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 pr-12"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-300 text-sm font-medium"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 pr-12"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={passwordStrength.color}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength <= 2
                            ? "bg-red-500"
                            : passwordStrength.strength <= 3
                            ? "bg-yellow-500"
                            : passwordStrength.strength <= 4
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-300 text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 pr-12"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Password Requirements
                </h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        passwordForm.newPassword.length >= 8
                          ? "bg-green-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[a-z]/.test(passwordForm.newPassword)
                          ? "bg-green-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    Contains lowercase letters
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[A-Z]/.test(passwordForm.newPassword)
                          ? "bg-green-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    Contains uppercase letters
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /\d/.test(passwordForm.newPassword)
                          ? "bg-green-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    Contains numbers
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword)
                          ? "bg-green-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    Contains special characters
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating Password...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Update Password
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Security Tips */}
      <div className="max-w-2xl">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                Use a unique password that you don't use for other accounts
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                Consider using a password manager to generate and store strong
                passwords
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                Never share your password with anyone or enter it on suspicious
                websites
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                Change your password immediately if you suspect it has been
                compromised
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
