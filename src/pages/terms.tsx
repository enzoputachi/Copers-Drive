import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Users, CreditCard, Bus } from "lucide-react";

// ... imports remain unchanged

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>Terms and Conditions - Corpers Drive</title>
        <meta name="description" content="Terms and conditions for using Corpers Drive transportation services" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 text-center bg-green-100">
          <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-3xl"></div>
          <div className="relative z-10 py-16 px-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6 hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please review these terms carefully before using our services
            </p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Compact Legal Summary */}
        <Card className="mb-8 bg-gradient-card border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl">
              <Shield className="mr-3 h-6 w-6 text-primary" />
              Corpers Drive – Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground text-base leading-relaxed">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Booking is only valid after full payment via official channels; tickets are non-transferable and expire 30 minutes after departure.
              </li>
              <li>
                Commitment fees are non-refundable. A 50% refund may be granted on request if full payment has already been made.
              </li>
              <li>
                Passengers must arrive at least 30 minutes before departure and may be required to present valid identification.
              </li>
              <li>
                Misconduct, smoking, alcohol, or illegal substance use is strictly prohibited during travel.
              </li>
              <li>
                A maximum of 10kg of luggage is allowed per passenger on the sprinter bus; excess luggage attracts additional fees.
              </li>
              <li>
                Corpers Drive is not liable for delays, missed trips, or lost items. Travel is undertaken at passengers’ own risk.
              </li>
              <li>
                Cancellations must be made at least 24 hours before departure. Refunds are at the company’s discretion.
              </li>
              <li>
                Pick-up services in Ijebu-Ode, Shagamu, and IFE must be pre-booked with full payment. Punctuality is mandatory.
              </li>
              <li>
                These Terms are governed by Nigerian law and Federal Road Safety Corps (FRSC) regulations.
              </li>
              <li>
                Booking or using our service means you agree to all terms. Contact us via email at <a href="mailto:corpersdrive@gmail.com" className="underline">corpersdrive@gmail.com</a> or call <a href="tel:+2348141241741" className="underline">08141241741</a>.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Agreement Section */}
        <Card className="mt-12 bg-gradient-card border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Agreement to Terms</h3>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
              By using Corpers Drive services, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/booking">
                <Button size="lg" className="min-w-48 bg-primary hover:bg-primary-dark">
                  Book Your Trip
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="min-w-48">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
