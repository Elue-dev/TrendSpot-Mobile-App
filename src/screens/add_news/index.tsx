import { Text } from "react-native";
import { useLayoutEffect, useRef, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import StepOne from "../../components/news/add_news/StepOne";
import StepTwo from "../../components/news/add_news/StepTwo";

export default function AddNews() {
  const [pageStep, setPageStep] = useState(1);
  const [values, setValues] = useState({
    title: "",
    readTime: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState("Unverified");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const richText = useRef<any>();

  const { isDarkMode } = useSheet();
  const navigation = useNavigation<NavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="font-semibold text-[18px] text-primaryColorSec dark:text-gray300">
          Add News
        </Text>
      ),
    });
  }, [isDarkMode]);

  const handleTextChange = (name: string, text: string) => {
    setValues({ ...values, [name]: text });
  };

  function nextStep() {
    setPageStep((currentStep) => currentStep + 1);
  }

  function previousStep() {
    if (pageStep === 1) return;
    setPageStep((currentStep) => currentStep - 1);
  }

  function resetFields() {
    setValues({
      title: "",
      readTime: "",
    });
    setImage(null);
    setVerificationStatus("Unverified");
    setContent("");
    setPageStep(1);
    setCategory("");
  }

  switch (pageStep) {
    case 1:
      return (
        <StepOne
          values={values}
          handleTextChange={handleTextChange}
          image={image}
          setImage={setImage}
          nextStep={nextStep}
          resetFields={resetFields}
        />
      );
    case 2:
      return (
        <StepTwo
          values={values}
          image={image}
          category={category}
          setCategory={setCategory}
          previousStep={previousStep}
          content={content}
          setContent={setContent}
          richText={richText}
          resetFields={resetFields}
        />
      );
    default:
      return null;
  }
}
