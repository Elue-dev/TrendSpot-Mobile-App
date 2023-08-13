import { View, Text, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import VerificationStart from "./VerificationStart";
import VerificationResults from "./VerificationResults";
import { News } from "../../types/news";
import Loader from "../../components/loader";

export default function VerifyScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const [verificationStep, setVerificationStep] = useState("start");
  const [keyword, setKeyword] = useState("");
  const [verificationResults, setVerificationResults] = useState<News[]>([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  function nextStep() {
    setVerificationStep("results");
  }

  function prevStep() {
    setVerificationStep("start");
  }

  if (loading) return <Loader />;

  switch (verificationStep) {
    case "start":
      return (
        <VerificationStart
          newsData={data}
          nextStep={nextStep}
          keyword={keyword}
          setKeyword={setKeyword}
          setVerificationResults={setVerificationResults}
        />
      );
    case "results":
      return (
        <VerificationResults
          prevStep={prevStep}
          keyword={keyword}
          setKeyword={setKeyword}
          verificationResults={verificationResults}
          setVerificationResults={setVerificationResults}
        />
      );
  }
}
