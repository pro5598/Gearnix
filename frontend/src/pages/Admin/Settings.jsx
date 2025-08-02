import { useState } from "react";
import {
  Settings,
  Save,
  Globe,
  Bell,
  Shield,
  Mail,
  Database,
  Palette,
  Users,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Gearnix Gaming Store",
    siteDescription: "Premium gaming gear and accessories",
    adminEmail: "admin@gearnix.com",
    timezone: "UTC",
    currency: "USD",
    language: "en",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    securityAlerts: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    twoFactorAuth: false,
    emailProvider: "smtp",
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    backupFrequency: "daily",
    maxFileSize: "10MB",
    allowedFileTypes: "jpg,png,pdf,doc",
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Admin Settings
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Configure your Gearnix platform settings
            </p>
          </div>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-gray-300 text-sm font-medium">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription" className="text-gray-300 text-sm font-medium">
                Site Description
              </Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-gray-300 text-sm font-medium">
                Admin Email
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="UTC" className="text-white hover:bg-gray-700">UTC</SelectItem>
                    <SelectItem value="EST" className="text-white hover:bg-gray-700">EST</SelectItem>
                    <SelectItem value="PST" className="text-white hover:bg-gray-700">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="USD" className="text-white hover:bg-gray-700">USD</SelectItem>
                    <SelectItem value="EUR" className="text-white hover:bg-gray-700">EUR</SelectItem>
                    <SelectItem value="GBP" className="text-white hover:bg-gray-700">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-gray-500 text-xs">Enable 2FA for admin accounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                  className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Allow User Registration</Label>
                  <p className="text-gray-500 text-xs">Allow new users to register</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                  className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-gray-500 text-xs">Enable maintenance mode</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <Label className="text-gray-300 text-sm font-medium">Email Notifications</Label>
                <p className="text-gray-500 text-xs">General email notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <Label className="text-gray-300 text-sm font-medium">Order Notifications</Label>
                <p className="text-gray-500 text-xs">New order notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.orderNotifications}
                onChange={(e) => handleInputChange('orderNotifications', e.target.checked)}
                className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <Label className="text-gray-300 text-sm font-medium">Low Stock Alerts</Label>
                <p className="text-gray-500 text-xs">Product low stock alerts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.lowStockAlerts}
                onChange={(e) => handleInputChange('lowStockAlerts', e.target.checked)}
                className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <Label className="text-gray-300 text-sm font-medium">Security Alerts</Label>
                <p className="text-gray-500 text-xs">Security-related alerts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.securityAlerts}
                onChange={(e) => handleInputChange('securityAlerts', e.target.checked)}
                className="w-11 h-6 bg-gray-600 rounded-full relative appearance-none cursor-pointer transition-colors checked:bg-purple-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Email Provider</Label>
              <Select value={settings.emailProvider} onValueChange={(value) => handleInputChange('emailProvider', value)}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="smtp" className="text-white hover:bg-gray-700">SMTP</SelectItem>
                  <SelectItem value="sendgrid" className="text-white hover:bg-gray-700">SendGrid</SelectItem>
                  <SelectItem value="mailgun" className="text-white hover:bg-gray-700">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">SMTP Host</Label>
                <Input
                  value={settings.smtpHost}
                  onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="smtp.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">SMTP Port</Label>
                <Input
                  value={settings.smtpPort}
                  onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="587"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">SMTP Username</Label>
              <Input
                value={settings.smtpUsername}
                onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">SMTP Password</Label>
              <Input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Backup Frequency</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="daily" className="text-white hover:bg-gray-700">Daily</SelectItem>
                  <SelectItem value="weekly" className="text-white hover:bg-gray-700">Weekly</SelectItem>
                  <SelectItem value="monthly" className="text-white hover:bg-gray-700">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Max File Size</Label>
              <Select value={settings.maxFileSize} onValueChange={(value) => handleInputChange('maxFileSize', value)}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="5MB" className="text-white hover:bg-gray-700">5MB</SelectItem>
                  <SelectItem value="10MB" className="text-white hover:bg-gray-700">10MB</SelectItem>
                  <SelectItem value="20MB" className="text-white hover:bg-gray-700">20MB</SelectItem>
                  <SelectItem value="50MB" className="text-white hover:bg-gray-700">50MB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Allowed File Types</Label>
              <Input
                value={settings.allowedFileTypes}
                onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
                placeholder="jpg,png,pdf,doc"
              />
              <p className="text-gray-500 text-xs">Comma-separated file extensions</p>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Database className="h-4 w-4 mr-2" />
                Run System Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
