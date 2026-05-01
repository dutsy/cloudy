'use client'
import { toast } from "sonner";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import { useCart } from "@/components/shared/cart-context";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";


const ProductCard = ({ product }: { product: any }) => {
    const { addItem, removeItem } = useCart();

    

  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleConfirmAdd = () => {
  // 1. Add the item with the note to our context
  addItem(product, note);

  // 2. Success Toast with the Undo feature
  toast.success(`${product.name} added!`, {
    description: note ? `Note: ${note}` : "Enjoy your Cloudy experience.",
    action: {
      label: "Undo",
      // We pass BOTH id and note to removeItem so it finds the right one!
      onClick: () => removeItem(product.id, note),
    },
  });

  // 3. Reset and Close
  setNote(""); 
  setIsOpen(false);
};

  


    return ( <Card className="w-full max-w-sm">
        <CardHeader className='p-0 items-center'>
            <Link href={`/product/${product.slug}`}>
            <Image src={product.images[0] || PRODUCT_PLACEHOLDER} alt={product.name} height={300} width={300} priority={true} />
            </Link>
        </CardHeader>
        <CardContent className="p-4 grid gap-4" >
            <div className="test-xs">
                {product.brand}
            </div>
            {/* <Link href={`/product/${product.slug}`}> */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
  {/* The Trigger: This replaces your direct onClick={handleAdd} */}
  <DialogTrigger asChild>
    <Button 
      variant="default"
      className="rounded-full px-6"
    >
      <h2 className="text-sm font-medium">
        {product.name}
      </h2>
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Customize Your Order</DialogTitle>
  </DialogHeader>
  
  <div className="grid gap-6 py-4">
    {/* PRODUCT PREVIEW SECTION */}
    <div className="flex items-center gap-4 p-3 border rounded-xl bg-zinc-50/50">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill 
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="font-bold text-lg">{product.name}</h4>
        <p className="text-sm text-muted-foreground">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>

    {/* NOTES SECTION */}
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Special Instructions
      </label>
      <Textarea 
        placeholder="e.g. Extra hot, no sugar, light ice..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <p className="text-[10px] text-zinc-400">
        *Notes are saved per item in your cart.
      </p>
    </div>
  </div>

  <DialogFooter>
    <Button 
      type="submit" 
      onClick={handleConfirmAdd} 
      className="w-full rounded-full h-12 text-base shadow-lg"
    >
      Add to Cart — ${Number(product.price).toFixed(2)}
    </Button>
  </DialogFooter>
</DialogContent>
</Dialog>
             <div className="flex-between gap-4">
                 <p>{product.description} </p>
            </div>
            <div className="flex-between gap-4">
                <p>{product.rating} Stars </p>
                {product.stock > 0 ? (<ProductPrice value={Number(product.price)} className="text-red-500" />) 
                : (<p className="text-destructive">Out of Stock</p>)}
            </div>
        </CardContent>
    </Card> );
}
 
export default ProductCard;

