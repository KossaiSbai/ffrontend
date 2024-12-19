"use client";

import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Brief, Influencer, Submission } from "../types";

const SubmissionReview: React.FC = () => {
  const statusBadgeColors: { [key: string]: string } = {
    pending: "bg-orange",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  };

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [influencerId, setInfluencerId] = useState<string>("");
  const [briefId, setBriefId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const [seeSubmissionText, setSeeSubmissionText] = useState(false);
  const [seeSubmissionFeedback, setSeeSubmissionFeedback] = useState(false);

  // Fetch submissions, influencers, and briefs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [submissionsRes, influencersRes, briefsRes] = await Promise.all([
          fetch(`${process.env.API_URL}/submissions`),
          fetch(`${process.env.API_URL}/influencers`),
          fetch(`${process.env.API_URL}/briefs`),
        ]);

        const submissionsData = await submissionsRes.json();
        const influencersData = await influencersRes.json();
        const briefsData = await briefsRes.json();

        setSubmissions(submissionsData);
        setFilteredSubmissions(submissionsData);
        setInfluencers(influencersData);
        setBriefs(briefsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (influencerId) {
      filtered = filtered.filter(
        (sub) => sub.influencer_id === parseInt(influencerId)
      );
    }
    if (briefId) {
      filtered = filtered.filter((sub) => sub.brief_id === parseInt(briefId));
    }
    setFilteredSubmissions(filtered);
  }, [influencerId, briefId, submissions]);

  const getInfluencerName = (id: number) => {
    const influencer = influencers.find((inf) => inf.id === id);
    return influencer ? influencer.name : "Unknown";
  };

  const getBriefName = (id: number) => {
    const brief = briefs.find((b) => b.id === id);
    return brief ? brief.name : "Unknown";
  };

  return (
    <div className="p-6 mx-auto h-full max-w-7xl rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Submission Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-1/3">
                  <label className="block text-gray-700 mb-2">
                    Select Influencer
                  </label>
                  <Select onValueChange={setInfluencerId} value={influencerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Influencer" />
                    </SelectTrigger>
                    <SelectContent>
                      {influencers.map((influencer) => (
                        <SelectItem
                          key={influencer.id}
                          value={influencer.id.toString()}
                        >
                          {influencer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-1/3">
                  <label className="block text-gray-700 mb-2">
                    Select Brief
                  </label>
                  <Select onValueChange={setBriefId} value={briefId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Brief" />
                    </SelectTrigger>
                    <SelectContent>
                      {briefs.map((brief) => (
                        <SelectItem key={brief.id} value={brief.id.toString()}>
                          {brief.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table className="rounded-lg overflow-hidden shadow">
                <TableHeader className="bg-[#f6f7f9]">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Influencer Name</TableHead>
                    <TableHead>Brief Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className="hover:bg-[#f6f7f9] transition duration-200"
                      >
                        <TableCell>{submission.id}</TableCell>
                        <TableCell>
                          {getInfluencerName(submission.influencer_id)}
                        </TableCell>
                        <TableCell>
                          {getBriefName(submission.brief_id)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              statusBadgeColors[submission.status]
                            } text-sm font-semibold`}
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setSeeSubmissionText(true);
                            }}
                            className="bg-[#fcb150] text-white hover:bg-[#e39f48] mr-2"
                          >
                            View Text
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setSeeSubmissionFeedback(true);
                            }}
                            className="bg-[#fcb150] text-white hover:bg-[#e39f48]"
                          >
                            View Feedback
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        No submissions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      <>
        <Dialog
          open={selectedSubmission != null && seeSubmissionText}
          onOpenChange={() => {
            setSelectedSubmission(null);
            setSeeSubmissionText(false);
          }}
        >
          <DialogContent className="overflow-y-scroll max-h-screen">
            <DialogHeader>
              <DialogTitle>Submission Text</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="whitespace-pre-wrap">
                  {selectedSubmission?.text || "No text available"}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={selectedSubmission != null && seeSubmissionFeedback}
          onOpenChange={() => {
            setSelectedSubmission(null);
            setSeeSubmissionFeedback(false);
          }}
        >
          <DialogContent className="overflow-y-scroll max-h-screen">
            <DialogHeader>
              <DialogTitle>Submission Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <ReactMarkdown
                  className="prose max-w-full text-gray-800 whitespace-pre-wrap"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {selectedSubmission?.feedback || "No feedback available"}
                </ReactMarkdown>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};

export default SubmissionReview;
