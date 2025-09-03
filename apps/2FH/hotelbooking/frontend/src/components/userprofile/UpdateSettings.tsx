import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UpdateSettings() {
  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Security & Settings</h1>
          <p className="text-gray-600">Keep your account safe with a secure password</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Card */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 uppercase tracking-wide">Email</h3>
                <p className="text-lg text-gray-900">n.shagai@pinecone.mn</p>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-gray-900">Change password</h3>
              </div>
              <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
