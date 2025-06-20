"use client";

import { useState, FormEvent } from 'react';
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

export default function StudentEnrollmentForm() {
  const [formData, setFormData] = useState({
    surname: '',
    given_name: '',
    sex: '',
    date_of_birth: '',
    grade: '',
    school_emis_code: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('students').insert([formData]);
    if (error) {
      toast.error("Failed to register student: " + error.message);
    } else {
      toast.success("Student registered successfully!");
      setFormData({ surname: '', given_name: '', sex: '', date_of_birth: '', grade: '', school_emis_code: '' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8">
      <Card className="shadow-xl rounded-2xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Surname</Label>
              <Input name="surname" value={formData.surname} onChange={handleChange} required />
            </div>
            <div>
              <Label>Given Name</Label>
              <Input name="given_name" value={formData.given_name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Sex</Label>
              <select name="sex" value={formData.sex} onChange={handleChange} className="w-full border rounded p-2" required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
            </div>
            <div>
              <Label>Grade</Label>
              <Input name="grade" value={formData.grade} onChange={handleChange} required />
            </div>
            <div>
              <Label>School EMIS Code</Label>
              <Input name="school_emis_code" value={formData.school_emis_code} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full">Register Student</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
