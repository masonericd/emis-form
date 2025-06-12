"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Location {
  county: string;
  district: string;
}

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

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from('locations').select('*');
      if (!error && data) setLocations(data as Location[]);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
      });
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;
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

  const handleSubmit = async (e: FormEvent) => {
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
