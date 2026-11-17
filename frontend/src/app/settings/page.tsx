"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
        <p className="text-slate-500">Configure your HelioGrid AI experience and system preferences.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase">Automation Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Weather-Driven Optimization</Label>
                <p className="text-xs text-slate-500">Automatically adjust export based on forecast.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">AI Agent Proactive Alerts</Label>
                <p className="text-xs text-slate-500">Let the agent message you about critical events.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase">API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">Google Gemini API Key</Label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value="AIzaSyC6sfkwePIUdDUZrJLrvMtMAs3oSGhD7H0" 
                  disabled
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-500"
                />
                <Button variant="outline" className="text-xs">Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
