# mecaneer23.github.io

[![GitHub](resources/gearsNoBackground.png)](https://mecaneer23.github.io)

Personal website for Mecaneer23

## Bugs

- If screen is resized while sidebar is open, the sidebar length doesn't adjust. This is due to JavaScript being slow when polling for resize events every tick, so this should not be changed until JavaScript gets faster or someone else comes up with a better solution.
- Scroll while modal is open breaks modal closing animation positioning
