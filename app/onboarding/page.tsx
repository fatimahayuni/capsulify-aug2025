"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BODY_TYPES } from "../constants";
import { getBodyTypeDescription, getOutfits } from "../constants/utils";
import { FaInfoCircle } from "react-icons/fa";
import { updateUserBodyType } from "../lib/actions/user.actions";
import { useAuth } from "@clerk/nextjs";

export default function OnboardingPage() {
  const { userId: clerkId } = useAuth();
  const [step, setStep] = useState(1);
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [wardrobe, setWardrobe] = useState<any>({});
  const [outfits, setOutfits] = useState<any>([]); // Assuming outfits are fetched or generated based on wardrobe
  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && bodyType) {
      // Fetch wardrobe for selected body type
      const generatedWardrobe = getBodyTypeDescription(bodyType);
      setWardrobe(generatedWardrobe);
    }

    if (step === 2 && bodyType) {
      const generatedWardrobe = BODY_TYPES.find(
        (type) => type.name === bodyType
      )?.clothingItems;
      setWardrobe(generatedWardrobe);
    }

    if (step === 4) {
      // Fetch outfits based on wardrobe (mock or real)
      const generatedOutfits = getOutfits(bodyType as string);
      setOutfits(generatedOutfits);
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    sessionStorage.setItem("bodyType", bodyType!);
    sessionStorage.setItem("clerkId", clerkId!);
    // update user bodyType in database
    await updateUserBodyType(bodyType!, clerkId as string);
    router.push("/inventory");
  };

  return (
    <div>
      {step === 1 && (
        <Step1_SelectBodyType
          bodyType={bodyType}
          setBodyType={setBodyType}
          handleNext={handleNext}
        />
      )}
      {step === 2 && (
        <Step2_ShowBodyTypeResults
          bodyType={bodyType}
          setStep={setStep}
          handleNext={handleNext}
        />
      )}
      {step === 3 && (
        <Step2_ShowWardrobe wardrobe={wardrobe} setStep={setStep} />
      )}

      {step === 4 && <OutfitIntro setStep={setStep} handleNext={handleNext} />}
      {step === 5 && (
        <Step3_ShowOutfits
          outfits={outfits}
          handleSubmit={handleSubmit}
          setStep={setStep}
        />
      )}
    </div>
  );
}

function Step1_SelectBodyType({ bodyType, setBodyType, handleNext }: any) {
  return (
    <div className="body-type-container">
      <h1 className="body-type-title">Pick Your Body Type!</h1>
      <div className="body-type-grid">
        {BODY_TYPES.map((type) => (
          <div
            key={type.name}
            className={`body-type-item ${
              bodyType === type.name ? "selected" : ""
            }`}
            onClick={() => {
              setBodyType(type.name);
              handleNext();
            }}
          >
            <div className="body-type-image-wrapper">
              <img
                src={type.image}
                alt={type.name}
                className="body-type-image"
              />
            </div>
            <div className="body-type-text-container">
              <h3 className="body-type-name">{type.name}</h3>
              <p className="body-type-description">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2_ShowBodyTypeResults({ bodyType, setStep, handleNext }: any) {
  const { description, recommendations, benefits } =
    getBodyTypeDescription(bodyType);

  return (
    <div className="result-container">
      <div className="result-card">
        <p>
          Because your body shape is{" "}
          <span className="selected-body-type">{bodyType}</span>,
        </p>
        <p className="result-description">{description}</p>
        <p>You'll receive tailored recommendations for:</p>
        <p className="recommendations">{recommendations}</p>
        <p className="benefits">{benefits}</p>
      </div>

      <div className="navigation-arrows-container">
        <button
          className="nav-arrow-button"
          onClick={() => {
            // Logic to go back to the previous step
            setStep((prev: any) => prev - 1);
          }}
        >
          ‹
        </button>
        <button
          className="nav-arrow-button"
          onClick={() => {
            // Logic to go to the next step
            handleNext();
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}

function Step2_ShowWardrobe({ wardrobe, setStep }: any) {
  return (
    <div className="category-container">
      <div className="category-section">
        <div className="category-content">
          {Object.keys(wardrobe).map((key) => (
            <div key={key} className="category-block">
              {
                <div className="styling-tip">
                  <p className="styling-tip-text">
                    <span className="category">{key.toUpperCase()}</span>
                  </p>
                </div>
              }

              <div className="category-grid">
                {wardrobe[key].map((item: any) => (
                  <div
                    key={item.name}
                    className="category-item"
                    data-category={key}
                  >
                    <div className="info-icon-container">
                      <FaInfoCircle className="info-icon" />
                    </div>
                    <div className="image-wrapper">
                      <img
                        src={item.filename}
                        alt={item.name}
                        className="category-image"
                      />
                    </div>
                    <p className="category-name">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="navigation-arrows-container">
          <button
            className="nav-arrow-button"
            onClick={() => {
              // Logic to go back to the previous step
              setStep((prev: any) => prev - 1);
            }}
          >
            ‹
          </button>
          <button
            className="nav-arrow-button"
            onClick={() => {
              // Logic to go to the next step
              setStep((prev: any) => prev + 1);
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

function OutfitIntro({ setStep, handleNext }: any) {
  return (
    <div className="outfit-intro-container">
      <div className="outfit-intro-card">
        <div className="outfit-intro-content">
          <p className="outfit-intro-text">Let's bring your wardrobe to life</p>
          <p className="outfit-intro-subtext">
            Here's where the transformation begins: curated outfit ideas
            designed to flatter your body and reflect the woman you're becoming.
            You'll be able to customize everything with your own pieces later
            on.
          </p>
          <div className="navigation-arrows-container">
            <button
              className="nav-arrow-button"
              onClick={() => {
                // Logic to go back to the previous step
                setStep((prev: any) => prev - 1);
              }}
            >
              ‹
            </button>
            <button
              className="nav-arrow-button"
              onClick={() => {
                // Logic to go to the next step
                handleNext();
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3_ShowOutfits({ outfits, handleSubmit, setStep }: any) {
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  return (
    <div className="outfits-container">
      <div className="outfits-content">
        <div className="outfits-carousel">
          <button
            className="carousel-button"
            onClick={() =>
              setCurrentOutfitIndex((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={currentOutfitIndex === 0}
          >
            ‹
          </button>
          <div className="outfit-display">
            <p className="outfit-event-name">
              {outfits[currentOutfitIndex].event}
            </p>
            <div className="outfit-image-container">
              <img
                src={outfits[currentOutfitIndex].image}
                alt={`${outfits[currentOutfitIndex].event} outfit`}
                className="outfit-image"
              />
            </div>
          </div>
          <button
            className="carousel-button"
            onClick={() =>
              setCurrentOutfitIndex((prev) =>
                prev < outfits.length - 1 ? prev + 1 : prev
              )
            }
            disabled={currentOutfitIndex === outfits.length - 1}
          >
            ›
          </button>
        </div>
      </div>

      <div className="navigation-arrows-container bottom-buttons">
        <button
          className="next-button"
          onClick={() => {
            setStep((prev: any) => prev - 1);
          }}
        >
          Go back
        </button>
        <button className="next-button" onClick={() => handleSubmit()}>
          Take me to the app
        </button>
      </div>
    </div>
  );
}
