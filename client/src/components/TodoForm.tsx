import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { useRef, useEffect } from 'react';

const TodoForm = () => {
	const [newTodo, setNewTodo] = useState("");

	const queryClient = useQueryClient();

	// At the top of your component
	const inputRef = useRef<HTMLInputElement>(null);

	// Use useEffect to focus the input when component mounts
	useEffect(() => {
	if (inputRef.current) {
		inputRef.current.focus();
	}
	}, []);

	const {mutate:createTodo, isPending:isCreating} = useMutation({
		mutationKey:['createTodo'],
		mutationFn: async(e: React.FormEvent) => {
			e.preventDefault();
			try {
				const res = await fetch(BASE_URL + `/todos`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ body: newTodo }),
				});
				
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				setNewTodo("");
				return data;
			} catch (error:any) {
				throw new Error(error)
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (error:any) => {
			alert(error.message);
		}
	});

	return (
		<form onSubmit={createTodo}>
			<Flex gap={2}>
				<Input
					type='text'
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					ref={inputRef}
				/>
				<Button
					mx={2}
					type='submit'
					_active={{
						transform: "scale(.97)",
					}}
				>
					{isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};
export default TodoForm;