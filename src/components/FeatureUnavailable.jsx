import Link from 'next/link';
import { AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';

export default function FeatureUnavailable({
  title = 'Feature Temporarily Unavailable',
  description = 'This section is not included in the Vercel edition yet.',
}) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-10">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 mb-6">{description}</p>
          <p className="text-gray-600 mb-8">
            The Vercel deployment currently includes live market indices, top movers,
            and news. NSE-specialized backend features will return in a later phase
            with a dedicated data pipeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/market-news" className="btn-primary inline-flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back To Market News
            </Link>
            <Link
              href="/"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
