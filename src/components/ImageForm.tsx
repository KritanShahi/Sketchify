import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function ImageForm({ open, onClose, onSubmit }: Props) {
  const [imageName, setImageName] = useState("");

  if (!open) return null;

  return (
    <Overlay>
      <Modal>
        <h2>Name your Image</h2>

        <Input
          type="text"
          placeholder="Enter image name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />

        <ButtonRow>
          <Button onClick={onClose}>Cancel</Button>
          <UploadButton
            disabled={!imageName}
            onClick={() => {
              onSubmit(imageName);
              setImageName("");
            }}
          >
            Submit
          </UploadButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 320px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  margin-top: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.2rem;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #ddd;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
`;

const UploadButton = styled(Button)`
  background: #10b981;
  color: white;

  &:disabled {
    background: #9ca3af;
  }

  &:hover {
    background: #059669;
  }
`;
