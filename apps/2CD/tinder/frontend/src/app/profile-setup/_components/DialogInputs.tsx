'use client'

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileFormValues } from "@/type/profile-form";
import type { FormikHelpers } from 'formik';

const INTERESTS = [
    'Harry Potter', '90s Kid', 'SoundCloud', 'Spa', 'Self Care',
    'Heavy Metal', 'House Parties', 'Gymnastics', 'Documentaries',
    'Drama shows', 'Meditation', 'Foodie', 'Spotify', 'Fishing', 'Hockey',
    'Basketball', 'Fantasy movies', 'Home Workout', 'Theater',
    'Cafe hopping', 'Cars', 'Sneakers', 'Instagram', 'Hot Springs',
    'Walking', 'Running', 'Travel', 'Language Exchange', 'Movies',
    'Action movies', 'Animated movies', 'Crime shows',
    'Social Development', 'Gym', 'Social Media', 'Soul music', 'Hip Hop',
    'Skincare', 'Musical theater', 'Anime', 'Shisha', 'NBA',
];

interface DialogInputsProps {
  formik: Pick<FormikHelpers<ProfileFormValues>, 'setFieldValue'> & {
    values: ProfileFormValues;
  };
}

export const DialogInputs = ({ formik }: DialogInputsProps) => {
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (formik.values.interests) {
            setSelected(formik.values.interests);
        }
    }, [formik.values.interests]);

    const toggleInterest = (interest: string) => {
        setSelected((prev) => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            }
            if (prev.length >= 5) return prev;
            return [...prev, interest];
        });
    };

    const handleSave = () => {
        formik.setFieldValue('interests', selected);
    };

    return (
        <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm mb-1">Interests</label>
            <Dialog>
                <DialogTrigger asChild>
                    <button className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        {selected.length > 0 ? `Selected (${selected.length})` : 'Select Interests'}
                    </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 text-white max-w-lg rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">What are you into?</DialogTitle>
                        <p className="text-sm text-zinc-400">
                            You like what you like. Now, let everyone know.
                        </p>
                    </DialogHeader>

                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto py-4">
                        {INTERESTS.map((interest) => {
                            const isSelected = selected.includes(interest);
                            const isDisabled = !isSelected && selected.length >= 5;

                            const buttonClass = `
                                px-4 py-1 rounded-full border text-sm 
                                ${isSelected 
                                    ? 'bg-pink-500 text-white border-pink-500' 
                                    : 'bg-transparent text-zinc-300 border-zinc-600 hover:bg-zinc-700'}
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                            `;

                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    disabled={isDisabled}
                                    className={buttonClass.trim()}
                                >
                                    {interest}
                                </button>
                            );
                        })}
                    </div>

                    <DialogClose asChild>
                        <Button
                            onClick={handleSave}
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-bold"
                            disabled={selected.length < 3}
                        >
                            Save ({selected.length}/5)
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
};
