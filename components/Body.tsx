"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { QrGenerateRequest, QrGenerateResponse } from "@/utils/service";
import { QrCard } from "@/components/QrCard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import LoadingDots from "@/components/ui/loadingdots";
import downloadQrCode from "@/utils/downloadQrCode";
import va from "@vercel/analytics";
import { PromptSuggestion } from "@/components/PromptSuggestion";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

const promptSuggestions = [
  "A city view with clouds",
  "A beautiful glacier",
  "A forest overlooking a mountain",
  "A saharan desert",
];

const generateFormSchema = z.object({
  url: z.string().min(1),
  prompt: z.string().min(3).max(160),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const Body = ({
  imageUrl,
  prompt,
  redirectUrl,
  modelLatency,
  id,
}: {
  imageUrl?: string;
  prompt?: string;
  redirectUrl?: string;
  modelLatency?: number;
  id?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [response, setResponse] = useState<QrGenerateResponse | null>(null);
  const [submittedURL, setSubmittedURL] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: "onChange",

    // Set default values so that the form inputs are controlled components.
    defaultValues: {
      url: "",
      prompt: "",
    },
  });

  useEffect(() => {
    if (imageUrl && prompt && redirectUrl && modelLatency && id) {
      setResponse({
        image_url: imageUrl,

        model_latency_ms: modelLatency,
        id: id,
      });
      setSubmittedURL(redirectUrl);

      form.setValue("prompt", prompt);
      form.setValue("url", redirectUrl);
    }
  }, [imageUrl, modelLatency, prompt, redirectUrl, id, form]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      form.setValue("prompt", suggestion);
    },
    [form],
  );

  const handleSubmit = useCallback(
    async (values: GenerateFormValues) => {
      setIsLoading(true);
      setResponse(null);
      setSubmittedURL(values.url);

      try {
        const request: QrGenerateRequest = {
          url: values.url,
          prompt: values.prompt,
        };

        const response = await fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify(request),
        });

        // Handle API errors.
        if (!response.ok || response.status !== 200) {
          const text = await response.text();
          throw new Error(
            `Failed to generate QR code: ${response.status}, ${text}`,
          );
        }

        const data = await response.json();

        va.track("Generated QR Code", {
          prompt: values.prompt,
        });

        router.push(`/start/${data.id}`);
      } catch (error) {
        va.track("Failed to generate", {
          prompt: values.prompt,
        });
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },

    [router],
  );

  return (
    <div className="mb-0 flex w-full flex-col items-center justify-center p-4 sm:mb-28 lg:p-0">
      <div className="mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
        <div className="col-span-1">
          <h1 className="mb-10 text-3xl font-bold">Generate a QR Code</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>URL</FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="roomgpt.io" {...field} />
                      </FormControl>{" "}
                      <FormDescription>
                        This is what your QR code will link to.{" "}
                      </FormDescription>{" "}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A city view with clouds"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>{" "}
                      <FormDescription className="">
                        This is what the image in your QR code will look like.{" "}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="my-2">
                  <p className="mb-3 text-sm font-medium">Prompt suggestions</p>

                  <div className="grid grid-cols-1 gap-3 text-center text-sm text-gray-500 sm:grid-cols-2">
                    {promptSuggestions.map((suggestion) => (
                      <PromptSuggestion
                        key={suggestion}
                        suggestion={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mx-auto inline-flex w-full max-w-[200px] justify-center"
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
                  ) : response ? (
                    "✨ Regenerate"
                  ) : (
                    "Generate"
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          {submittedURL && (
            <>
              <h1 className="mb-5 mt-5 text-left text-3xl font-bold sm:mb-5 sm:mt-0 sm:text-center">
                Your QR Code
              </h1>
              <div>
                <div className="relative flex h-auto flex-col items-center justify-center">
                  {response ? (
                    <QrCard
                      imageURL={response.image_url}
                      time={(response.model_latency_ms / 1000).toFixed(2)}
                    />
                  ) : (
                    <div className="group relative mx-auto flex aspect-square w-[510px] max-w-full animate-pulse flex-col items-center justify-center gap-y-2 rounded border border-gray-300 bg-gray-400 p-2 shadow" />
                  )}
                </div>
                {response && (
                  <div className="mt-4 flex justify-center gap-5">
                    <Button
                      onClick={() =>
                        downloadQrCode(response.image_url, "qrCode")
                      }
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://qrgpt.io/start/${id || ""}`,
                        );
                        toast.success("Link copied to clipboard");
                      }}
                    >
                      ✂️ Share
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Body;
