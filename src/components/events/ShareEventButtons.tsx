import React from 'react';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types';
import toast from 'react-hot-toast';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Copy,
} from 'lucide-react';

interface ShareEventButtonsProps {
  event: Event;
}

const ShareEventButtons: React.FC<ShareEventButtonsProps> = ({ event }) => {
  const shareUrl = window.location.href;
  const shareTitle = `Check out ${event.title}!`;
  const shareText = `I found this amazing event: ${event.title} on ${event.date} at ${event.venue}`;
  
  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
            });
            toast.success("Successfully shared!");
          } else {
            throw new Error("Native sharing not supported");
          }
          break;
          
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          toast.success("Shared on Twitter!");
          break;
          
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          toast.success("Shared on Facebook!");
          break;
          
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          toast.success("Shared on LinkedIn!");
          break;
          
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
          toast.success("Email opened!");
          break;
          
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
          break;
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share event");
    }
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Share This Event</h3>
      <div className="flex flex-wrap gap-2">
        {typeof navigator.share === 'function' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleShare('native')}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/20"
        >
          <Twitter className="w-4 h-4 text-[#1DA1F2]" />
          Twitter
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/20"
        >
          <Facebook className="w-4 h-4 text-[#1877F2]" />
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-[#0A66C2]/20"
        >
          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          LinkedIn
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleShare('email')}
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleShare('copy')}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </Button>
      </div>
    </div>
  );
};

export default ShareEventButtons;