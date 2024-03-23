import subprocess
import tempfile
import shutil
from pathlib import Path
import os

def execute_command(command, timeout=None, working_directory=None, environment=None):
    """
    Executes a command in the terminal and returns its output.

    Args:
        command (str): The command to execute.
        timeout (float, optional): The timeout in seconds for the command execution. Defaults to None.
        working_directory (str, optional): The working directory for the command execution. Defaults to None.
        environment (dict, optional): The environment variables for the command execution. Defaults to None.

    Returns:
        tuple: A tuple containing the command output (stdout) and error output (stderr).
    """
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            if working_directory is None:
                working_directory = temp_dir

            result = subprocess.run(
                command,
                shell=True,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=timeout,
                cwd=working_directory,
                env=environment,
                text=True
            )

            return result.stdout, ""

    except subprocess.CalledProcessError as e:
        return "", e.stderr

    except subprocess.TimeoutExpired as e:
        return "", f"Command timed out after {timeout} seconds"

    except Exception as e:
        return "", str(e)


print(execute_command('cat requirements.txt', working_directory='.'))