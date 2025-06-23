"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WeatherDisplay from "./weather-display";
import { WeatherData } from "./weather-display";

interface LookupFormData {
  id: string;
}

function isValidDate(date: Date | undefined): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidId(id: string | undefined): boolean {
  if (!id) return false;

  const parts = id.split("-");
  if (parts.length < 4) return false;

  const dateString = parts.slice(-3).join("-");
  const locationPart = parts.slice(0, -3).join("-");
  const parsedDate = new Date(dateString);

  return (isValidDate(parsedDate)) && (locationPart.trim() === "");
}

export function LookupForm() {
  const [formData, setFormData] = useState<LookupFormData>({
    id: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: WeatherData;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:8000/weather/${formData.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          success: true,
          message: `Success! Here is the weather data stored with ID "${formData.id}":`,
          data: data,
        });
        // Reset form after successful submission
        setFormData({
          id: "",
        });
      } else {
        const errorData = await response.json();
        setResult({
          success: false,
          message: errorData.detail || "Failed to submit lookup request",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error: Could not connect to the server",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lookup Data Request</CardTitle>
        <CardDescription>
          Submit a lookup data request using an existing ID in the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              name="id"
              type="text"
              placeholder="e.g., New York-2025-06-23"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Lookup Request"}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md ${
                result.success
                  ? "bg-green-900/20 text-green-500 border border-green-500"
                  : "bg-red-900/20 text-red-500 border border-red-500"
              }`}
            >
              <p className="text-sm font-medium">{result.message}</p>
              {result.success && result.data && (
                <WeatherDisplay data={result.data} />
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
