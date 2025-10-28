import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

export default function WhatsAppShare({ text, url = '', className = '' }) {
  const [copied, setCopied] = useState(false);

  const shareToWhatsApp = () => {
    const shareText = `${text} ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Market Update',
          text: text,
          url: url,
        });
      } catch (error) {
        console.error('Web share failed:', error);
        shareToWhatsApp();
      }
    } else {
      shareToWhatsApp();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={shareViaWebShare}
        className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm"
        title="Share on WhatsApp"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
      
      <button
        onClick={copyToClipboard}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
}
