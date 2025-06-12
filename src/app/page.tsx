"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

const supabase = createClient(
  'https://uhrbaremzwtqyntjobht.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocmJhcmVtend0cXludGpvYmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjQ3MzIsImV4cCI6MjA2NTMwMDczMn0.XgymyQK40JrRBDPJfbGFgK9EkQrvuntYUfOUnpZMeyc'
);

export default function SchoolRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    emis_code: '',
    county: '',
    district: '',
    village: '',
    is_boarding: false,
    is_urban: false,
    phone: '',
    email: '',
    latitude: '',
    longitude: ''
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from('locations').select();
      if (!error) setLocations(data);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'county' ? { district: '' } : {})
    }));
  };

  const counties = [...new Set(locations.map(l => l.county))];
  const districts = formData.county
    ? locations.filter(l => l.county === formData.county).map(l => l.district)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('schools').insert([formData]);
    if (error) {
      toast.error("Failed to register school: " + error.message);
    } else {
      toast.success("School registered successfully!");
      setFormData({
        name: '', emis_code: '', county: '', district: '', village: '',
        is_boarding: false, is_urban: false, phone: '', email: '', latitude: '', longitude: ''
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8">
      <Card className="shadow-xl rounded-2xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>School Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label>EMIS Code</Label>
              <Input name="emis_code" value={formData.emis_code} onChange={handleChange} required />
            </div>
            <div>
              <Label>County</Label>
              <select name="county" value={formData.county} onChange={handleChange} className="w-full border rounded p-2">
                <option value="">Select County</option>
                {counties.map((county, index) => (
                  <option key={index} value={county}>{county}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>District</Label>
              <select name="district" value={formData.district} onChange={handleChange} className="w-full border rounded p-2" required>
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Specific Address</Label>
              <Input name="village" value={formData.village} onChange={handleChange} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" value={formData.email} onChange={handleChange} type="email" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_boarding" checked={formData.is_boarding} onChange={handleChange} /> Boarding School
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_urban" checked={formData.is_urban} onChange={handleChange} /> Urban Area
              </label>
            </div>
            <Button type="submit" className="w-full">Register School</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
