"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const SubmissionEvaluator = () => {
  const [submission, setSubmission] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefs, setBriefs] = useState([]);
  const [selectedBrief, setSelectedBrief] = useState("");

  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/briefs`);
        const data = await response.json();
        setBriefs(data);
      } catch (error) {
        console.error("Error fetching briefs:", error);
      }
    };
    fetchBriefs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch(`${process.env.API_URL}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission, briefId: selectedBrief }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader?.read();
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setFeedback((prev) => prev + chunk);
        }
        done = readerDone;
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback("An error occurred while evaluating the submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-4xl shadow-lg border border-gray">
        <CardHeader className=" text-codGray">
          <CardTitle className="text-center text-2xl font-semibold">
            Submission Evaluator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-codGray font-medium">
                Select a Brief
              </label>
              <Select onValueChange={setSelectedBrief} value={selectedBrief}>
                <SelectTrigger className="w-full border-gray focus:ring-brandy">
                  <SelectValue placeholder="Select a brief" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {briefs.map((brief) => (
                      <SelectItem key={brief.id} value={brief.id.toString()}>
                        {brief.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2 text-codGray font-medium">
                Enter Your Submission
              </label>
              <Textarea
                rows={6}
                value={submission}
                disabled={!selectedBrief}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder={
                  selectedBrief
                    ? "Paste your text here..."
                    : "Select a brief first"
                }
                className="border border-gray focus:ring-brandy"
              />
            </div>

            <Button
              type="submit"
              disabled={!selectedBrief || loading}
              className="w-full bg-orange hover:bg-codGray text-black font-semibold"
            >
              {loading ? "Evaluating..." : "Evaluate Submission"}
            </Button>
          </form>

          {feedback && (
            <div className="mt-8 p-4 bg-boulder bg-opacity-10 border border-gray rounded-md shadow-sm">
              <ReactMarkdown
                className="prose max-w-full text-gray-800 whitespace-pre-wrap"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {feedback}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionEvaluator;
