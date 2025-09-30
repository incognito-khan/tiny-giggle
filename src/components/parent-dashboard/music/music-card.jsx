"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, ShoppingCart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavoriteMusic } from "@/store/slices/favoriteSlice";

export function MusicCard({
  track,
  isCurrentTrack,
  isPlaying,
  onPlayPreview,
  onAddToCart,
}) {
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorite.favoriteMusic);
  const dispatch = useDispatch();

  const toggleFavorites = (musicId) => {
    dispatch(toggleFavoriteMusic({ parentId: user?.id, musicId }));
  };

  const isFavorite = favorites.some((f) => f.musicId === track?.id);
  return (
    <Card className="group overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-0">
        {/* Album Cover */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={track?.thumbnail || "/placeholder.svg"}
            alt={`${track?.title} album cover`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-end p-4">
              <Star
                className={`w-7 h-7 cursor-pointer`}
                stroke={isFavorite ? "#facc15" : "#e5e7eb"}
                fill={isFavorite ? "#facc15" : "none"}
                onClick={() => toggleFavorites(track?.id)}
              />
            </div>
            <div className="flex h-full items-center justify-center">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 bg-pink-600 hover:bg-pink-600/90 text-primary-foreground shadow-lg"
                onClick={() => onPlayPreview(track)}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
            </div>
          </div>

          {/* Playing Indicator */}
          {isCurrentTrack && isPlaying && (
            <div className="absolute top-4 right-4 bg-pink-600 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
              Playing
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-foreground mb-1 text-balance">
            {track?.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {track?.uploadedBy?.name}
          </p>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-pink-600">
              {track?.price ? `$${track?.price}` : "FREE"}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPlayPreview(track)}
                className="border-border hover:bg-pink-600 hover:text-white"
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Preview
              </Button>

              <Button
                size="sm"
                onClick={() => onAddToCart(track)}
                className="bg-pink-600 hover:bg-pink-600/90 text-primary-foreground"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
