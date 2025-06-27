import React from "react";
import Header from '../components/header';
import Footer from '../components/footer';
import { Link } from "react-router-dom";

export default function SupportMe() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-teal-700 mb-4 text-center">Support the Developer</h1>
        <p className="mb-6 text-gray-700 text-center">
          If you'd like to support my work on NewsFlashLatest, you can send a donation using the details below. Thank you for your generosity!
        </p>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-teal-600 mb-2">Bank Transfer</h2>
          <div className="bg-teal-50 rounded p-4">
            <div className="mb-2">
              <span className="font-medium text-gray-700">Bank Name:</span> <span className="text-gray-900">Zenith Bank</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Account Name:</span> <span className="text-gray-900">Victor Akande</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Account Number:</span> <span className="text-gray-900">2278372908</span>
            </div>
          </div>
        </div>
        {/* <div className="mb-6">
          <h2 className="text-lg font-semibold text-teal-600 mb-2">Paystack Payment</h2>
          <a
            href="https://paystack.com/pay/YOUR-PAGE-ID"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition font-semibold"
          >
            <img src="/paystack-logo.svg" alt="Paystack" className="w-6 h-6" />
            Pay via Paystack
          </a>
        </div> */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-teal-600 mb-2">Contact</h2>
          <a
            href="mailto:victorakande090@gmail.com"
            className="text-teal-700 hover:underline"
          >
            victorakande090@gmail.com
          </a>
        </div>
        <div className="text-center">
          <Link to="/" className="text-teal-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}